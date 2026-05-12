import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import * as reportsService from '../services/reports.service';
import prisma from '../prisma';

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
