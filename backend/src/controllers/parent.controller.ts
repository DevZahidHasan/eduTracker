import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import * as reportsService from '../services/reports.service';
import { generateReportCardHtml } from '../utils/reportCardHtmlGenerator';
import { generatePdfFromHtml } from '../utils/pdfGenerator';

export const getParentDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  // 1. Find all students linked to this parent
  const students = await prisma.student.findMany({
    where: { parentId: userId },
    select: {
      id: true,
      studentId: true,
      fullName: true,
      className: true,
      section: true,
      rollNumber: true,
      profileImage: true,
    }
  });

  // 2. Gather data for each student
  const dashboardData = await Promise.all(students.map(async (student) => {
    // A. Today's Attendance
    const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');
    const todayAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today
        }
      },
      select: { status: true }
    });

    // B. Unpaid Fee Vouchers
    const unpaidVouchers = await prisma.feeVoucher.findMany({
      where: {
        studentId: student.id,
        status: 'UNPAID'
      },
      select: {
        id: true,
        month: true,
        year: true,
        totalAmount: true,
        dueDate: true
      },
      orderBy: { dueDate: 'asc' }
    });

    // C. Recent Academic Reports (Term Results)
    const recentReports = await prisma.termResult.findMany({
      where: { studentId: student.id },
      select: {
        examType: true,
        percentage: true,
        grade: true,
        status: true
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    let subjectMarks: { subject: string; score: number; maxScore: number }[] = [];
    if (recentReports.length > 0) {
      subjectMarks = await prisma.mark.findMany({
        where: {
          studentId: student.id,
          examType: recentReports[0].examType
        },
        select: {
          subject: true,
          score: true,
          maxScore: true
        }
      });
    }

    return {
      student,
      attendanceToday: todayAttendance?.status || 'NOT_MARKED',
      unpaidVouchers,
      totalDue: unpaidVouchers.reduce((sum, v) => sum + v.totalAmount, 0),
      latestResult: recentReports.length > 0 ? {
        ...recentReports[0],
        marks: subjectMarks
      } : null
    };
  }));

  return res.status(200).json(
    new ApiResponse(200, dashboardData, 'Parent dashboard data fetched successfully')
  );
});

export const getParentReportCard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId, examType } = req.params;
  const parentId = req.user?.id;

  if (!studentId || !examType) {
    throw new ApiError(400, 'Student ID and Exam Type are required');
  }

  // Verify parent-student relationship
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { parentId: true, fullName: true }
  });

  if (!student || student.parentId !== parentId) {
    throw new ApiError(403, 'You are not authorized to access this report');
  }

  const reportData = await reportsService.getStudentReportData(Number(studentId), examType);

  if (!reportData) {
    throw new ApiError(404, 'Student or Report data not found');
  }

  const schoolProfile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  
  const html = generateReportCardHtml(reportData, schoolProfile);
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ReportCard_${student.fullName.replace(/\s+/g, '_')}_${examType}.pdf`);
  return res.send(pdfBuffer);
});

export const getParentAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;
  const parentId = req.user?.id;

  if (!studentId) {
    throw new ApiError(400, 'Student ID is required');
  }

  // Verify parent-student relationship
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { parentId: true }
  });

  if (!student || student.parentId !== parentId) {
    throw new ApiError(403, 'You are not authorized to access this data');
  }

  const where: any = { studentId: Number(studentId) };

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string)
    };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    select: {
      date: true,
      status: true
    },
    orderBy: { date: 'asc' }
  });

  return res.status(200).json(
    new ApiResponse(200, attendance, 'Attendance fetched successfully')
  );
});

export const getParentFees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId } = req.params;
  const parentId = req.user?.id;

  if (!studentId) {
    throw new ApiError(400, 'Student ID is required');
  }

  // Verify parent-student relationship
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { parentId: true }
  });

  if (!student || student.parentId !== parentId) {
    throw new ApiError(403, 'You are not authorized to access this data');
  }

  // Fetch all vouchers for the student
  const vouchers = await prisma.feeVoucher.findMany({
    where: { studentId: Number(studentId) },
    include: {
      items: {
        include: {
          feeType: true
        }
      },
      payments: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(
    new ApiResponse(200, vouchers, 'Fee history fetched successfully')
  );
});

export const getParentResults = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId } = req.params;
  const { examType } = req.query;
  const parentId = req.user?.id;

  if (!studentId) {
    throw new ApiError(400, 'Student ID is required');
  }

  // Verify parent-student relationship
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { parentId: true }
  });

  if (!student || student.parentId !== parentId) {
    throw new ApiError(403, 'You are not authorized to access this data');
  }

  // If examType is provided, get detailed subject-wise marks
  if (examType) {
    const reportData = await reportsService.getStudentReportData(Number(studentId), examType as string);
    if (!reportData) {
      throw new ApiError(404, 'No report data found for this exam type');
    }
    return res.status(200).json(
      new ApiResponse(200, reportData, 'Subject-wise results fetched successfully')
    );
  }

  // Otherwise, get historical TermResult aggregates with subject marks
  // We construct the BD standard terms (Term 1, Term 2, Term 3)
  const terms = [1, 2, 3];
  const results = [];

  for (const term of terms) {
    const reportData = await reportsService.getStudentReportData(Number(studentId), `TERM_${term}`);
    
    if (reportData && reportData.marks.length > 0) {
      // Check if both tutorial and final are published
      const termExamTypes = await prisma.examType.findMany({
        where: { termNumber: term }
      });
      
      const publishedResults = await prisma.termResult.findMany({
        where: {
          studentId: Number(studentId),
          examType: { in: termExamTypes.map(e => e.name) }
        }
      });
      
      const tutorialTypes = termExamTypes.filter(e => e.category === 'TUTORIAL').map(e => e.name);
      const finalTypes = termExamTypes.filter(e => e.category === 'FINAL').map(e => e.name);

      const hasTutorial = tutorialTypes.length === 0 || publishedResults.some(pr => tutorialTypes.includes(pr.examType));
      const hasFinal = finalTypes.length === 0 || publishedResults.some(pr => finalTypes.includes(pr.examType));
      
      results.push({
        examType: `TERM_${term}`,
        title: `Term ${term} Result`,
        percentage: (reportData as any).percentage || (reportData.gpa ? (reportData.gpa / 5) * 100 : 0), 
        gpa: reportData.gpa,
        grade: reportData.grade,
        marks: reportData.marks, // Contains { subject, tutorial, final, score, maxScore, grade }
        canDownload: hasTutorial && hasFinal
      });
    }
  }

  // Also fetch Annual Result if it exists
  const annualReportData = await reportsService.getStudentReportData(Number(studentId), 'Annual Result');
  if (annualReportData && annualReportData.marks.length > 0) {
     const isAnnualPublished = await prisma.termResult.findFirst({
        where: { studentId: Number(studentId), examType: 'Annual Result' }
     });
     results.push({
        examType: 'Annual Result',
        title: 'Annual Master Report',
        percentage: (annualReportData as any).percentage || (annualReportData.gpa ? (annualReportData.gpa / 5) * 100 : 0),
        gpa: annualReportData.gpa,
        grade: annualReportData.grade,
        marks: annualReportData.marks,
        canDownload: !!isAnnualPublished
     });
  }

  return res.status(200).json(
    new ApiResponse(200, results, 'Aggregate results fetched successfully')
  );
});
