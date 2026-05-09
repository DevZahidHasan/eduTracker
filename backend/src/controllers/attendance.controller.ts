import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, date } = req.query;
  const whereClause: any = {};
  if (studentId) whereClause.studentId = Number(studentId);
  if (date) whereClause.date = { equals: new Date(date as string) };
  
  const attendances = await prisma.attendance.findMany({ where: whereClause });
  
  return res.status(200).json(
    new ApiResponse(200, attendances, 'Attendance records fetched successfully')
  );
});

export const getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const attendance = await prisma.attendance.findUnique({ where: { id: Number(id) } });
  
  if (!attendance) {
    throw new ApiError(404, 'Attendance record not found');
  }

  return res.status(200).json(
    new ApiResponse(200, attendance, 'Attendance record fetched successfully')
  );
});

export const createAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, date, status } = req.body;
  
  if (!studentId || !status) {
    throw new ApiError(400, 'Student ID and status are required');
  }

  const attendance = await prisma.attendance.create({
    data: {
      studentId,
      date: date ? new Date(date) : undefined,
      status,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, attendance, 'Attendance record created successfully')
  );
});

export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, date } = req.body;

  const attendance = await prisma.attendance.update({
    where: { id: Number(id) },
    data: {
      status,
      date: date ? new Date(date) : undefined,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, attendance, 'Attendance record updated successfully')
  );
});

export const deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.attendance.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Attendance record deleted successfully')
  );
});
