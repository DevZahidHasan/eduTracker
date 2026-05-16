import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import * as reportsService from '../services/reports.service';
import prisma from '../prisma';
import { generateReportCardHtml, reportCardStyles } from '../utils/reportCardHtmlGenerator';
import { generatePdfFromHtml } from '../utils/pdfGenerator';

export const getStudentReport = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, examType } = req.query;

  if (!studentId || !examType) {
    throw new ApiError(400, 'Student ID and Exam Type are required');
  }

  const reportData = await reportsService.getStudentReportData(Number(studentId), examType as string);
  
  if (!reportData) {
    throw new ApiError(404, 'Student or Report data not found');
  }

  return res.status(200).json(new ApiResponse(200, reportData, 'Report card data fetched successfully'));
});

export const getConsolidatedReport = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, examType } = req.params;

  if (!studentId || !examType) {
    throw new ApiError(400, 'Student ID and Exam Type are required');
  }

  const reportData = await reportsService.getStudentReportData(Number(studentId), examType);
  
  if (!reportData) {
    throw new ApiError(404, 'Student or Report data not found');
  }

  // Ensure AcademicReport and TermResult are up to date
  await reportsService.generateOrUpdateReport(Number(studentId), examType);

  return res.status(200).json(new ApiResponse(200, reportData, 'Consolidated report fetched successfully'));
});

export const exportReportCardPdf = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, examType } = req.params;

  if (!studentId || !examType) {
    throw new ApiError(400, 'Student ID and Exam Type are required');
  }

  const reportData = await reportsService.getStudentReportData(Number(studentId), examType);
  
  if (!reportData) {
    throw new ApiError(404, 'Student or Report data not found');
  }

  const schoolProfile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  
  const html = generateReportCardHtml(reportData, schoolProfile);
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ReportCard_${reportData.student.fullName.replace(/\s+/g, '_')}_${examType}.pdf`);
  return res.send(pdfBuffer);
});

export const exportClassReportCardsPdf = asyncHandler(async (req: Request, res: Response) => {
  const { className, examType } = req.params;
  const { section } = req.query;

  if (!className || !examType) {
    throw new ApiError(400, 'Class Name and Exam Type are required');
  }

  const whereClause: any = { className };
  if (section) whereClause.section = section as string;

  const students = await prisma.student.findMany({
    where: whereClause,
    select: { id: true, fullName: true }
  });

  if (students.length === 0) {
    throw new ApiError(404, 'No students found for this class/section');
  }

  const schoolProfile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  
  let combinedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      ${reportCardStyles}
      <style>
        .page-break { page-break-after: always; }
        @media print { .page-break { page-break-after: always; } }
        body { background-color: #fff; padding: 0; }
      </style>
    </head>
    <body>
  `;

  for (let i = 0; i < students.length; i++) {
    const reportData = await reportsService.getStudentReportData(students[i].id, examType);
    if (reportData) {
      const singleHtml = generateReportCardHtml(reportData, schoolProfile);
      // Strip outer HTML tags to combine them
      const contentOnly = singleHtml.substring(singleHtml.indexOf('<body>') + 6, singleHtml.lastIndexOf('</body>'));
      combinedHtml += `<div class="report-container">${contentOnly}</div>`;
      if (i < students.length - 1) {
        combinedHtml += '<div class="page-break"></div>';
      }
    }
  }

  combinedHtml += '</body></html>';
  
  const pdfBuffer = await generatePdfFromHtml(combinedHtml);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ReportCards_${className}_${section || 'All'}_${examType}.pdf`);
  return res.send(pdfBuffer);
});

export const updateTeacherRemarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, examType, remarks } = req.body;

  if (!studentId || !examType) {
    throw new ApiError(400, 'Student ID and Exam Type are required');
  }

  const updatedReport = await reportsService.generateOrUpdateReport(Number(studentId), examType as string, remarks);

  return res.status(200).json(new ApiResponse(200, updatedReport, 'Teacher remarks updated successfully'));
});

export const getClassPerformance = asyncHandler(async (req: Request, res: Response) => {
  const { className, examType, section } = req.query;

  if (!className || !examType) {
    throw new ApiError(400, 'Class Name and Exam Type are required');
  }

  const performance = await reportsService.getClassPerformance(className as string, examType as string, section as string | undefined);

  return res.status(200).json(new ApiResponse(200, performance, 'Class performance report fetched successfully'));
});

export const getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
  const { className, section, startDate, endDate } = req.query;

  const where: any = {};
  if (className) where.className = className as string;
  if (section) where.section = section as string;

  const students = await prisma.student.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      rollNumber: true,
      className: true,
      section: true
    }
  });

  const start = startDate ? new Date(startDate as string) : undefined;
  const end = endDate ? new Date(endDate as string) : undefined;

  const summary = await Promise.all(students.map(async (s) => {
    const rate = await reportsService.getAttendanceStats(s.id, start, end);
    return {
      ...s,
      attendanceRate: rate
    };
  }));

  return res.status(200).json(new ApiResponse(200, summary, 'Attendance summary fetched successfully'));
});
