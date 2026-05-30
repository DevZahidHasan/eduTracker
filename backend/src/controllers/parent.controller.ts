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

    return {
      student,
      attendanceToday: todayAttendance?.status || 'NOT_MARKED',
      unpaidVouchers,
      totalDue: unpaidVouchers.reduce((sum, v) => sum + v.totalAmount, 0),
      latestResult: recentReports.length > 0 ? recentReports[0] : null
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

  // Otherwise, get historical TermResult aggregates
  const results = await prisma.termResult.findMany({
    where: { studentId: Number(studentId) },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(
    new ApiResponse(200, results, 'Aggregate results fetched successfully')
  );
});
