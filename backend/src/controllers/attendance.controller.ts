import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma, AttendanceStatus } from '@prisma/client';
import { sendParentAttendanceNotification } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, date, className } = req.query;
  const whereClause: Prisma.AttendanceWhereInput = {};
  
  if (studentId) whereClause.studentId = Number(studentId);
  if (date) whereClause.date = { equals: new Date(date as string) };
  
  if (className) {
    whereClause.student = {
      className: className as string
    };
  }
  
  const attendances = await prisma.attendance.findMany({ 
    where: whereClause,
    include: {
      student: {
        select: {
          fullName: true,
          rollNumber: true,
          studentId: true
        }
      }
    }
  });
  
  return res.status(200).json(
    new ApiResponse(200, attendances, 'Attendance records fetched successfully')
  );
});

export const bulkCreateAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { records } = req.body as { records: { studentId: number | string, date: string, status: AttendanceStatus }[] };

  if (!records || !Array.isArray(records)) {
    throw new ApiError(400, 'Attendance records array is required');
  }

  // Use a transaction to ensure all or nothing
  const results = await prisma.$transaction(
    records.map((record) => {
      const { studentId, date, status } = record;
      const attendanceDate = new Date(date);
      
      // Reset time to midnight for consistency
      attendanceDate.setHours(0, 0, 0, 0);

      return prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: Number(studentId),
            date: attendanceDate,
          },
        },
        update: {
          status,
        },
        create: {
          studentId: Number(studentId),
          date: attendanceDate,
          status,
        },
      });
    })
  );

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Attendance', 'BULK', req.user.id, null, { count: results.length, records });
  }

  // Trigger parent notifications in background
  results.forEach(record => {
    sendParentAttendanceNotification(record.id).catch(err => 
      console.error(`Failed to send notification for attendance ${record.id}:`, err)
    );
  });

  return res.status(200).json(
    new ApiResponse(200, results, 'Bulk attendance processed successfully')
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

export const createAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId, date, status } = req.body;
  
  if (!studentId || !status) {
    throw new ApiError(400, 'Student ID and status are required');
  }

  const attendance = await prisma.attendance.create({
    data: {
      studentId: Number(studentId),
      date: date ? new Date(date) : undefined,
      status,
    },
  });

  if (req.user) {
    await AuditService.logChange('CREATE', 'Attendance', attendance.id, req.user.id, null, attendance);
  }

  sendParentAttendanceNotification(attendance.id).catch(err => 
    console.error(`Failed to send notification for attendance ${attendance.id}:`, err)
  );

  return res.status(201).json(
    new ApiResponse(201, attendance, 'Attendance record created successfully')
  );
});

export const updateAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, date } = req.body;

  const oldAttendance = await prisma.attendance.findUnique({
    where: { id: Number(id) }
  });

  if (!oldAttendance) {
    throw new ApiError(404, 'Attendance record not found');
  }

  const attendance = await prisma.attendance.update({
    where: { id: Number(id) },
    data: {
      status,
      date: date ? new Date(date) : undefined,
    },
  });

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Attendance', id, req.user.id, oldAttendance, attendance);
  }

  sendParentAttendanceNotification(attendance.id).catch(err => 
    console.error(`Failed to send notification for attendance ${attendance.id}:`, err)
  );

  return res.status(200).json(
    new ApiResponse(200, attendance, 'Attendance record updated successfully')
  );
});

export const deleteAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const oldAttendance = await prisma.attendance.findUnique({
    where: { id: Number(id) }
  });

  if (!oldAttendance) {
    throw new ApiError(404, 'Attendance record not found');
  }

  await prisma.attendance.delete({
    where: { id: Number(id) },
  });

  if (req.user) {
    await AuditService.logChange('DELETE', 'Attendance', id, req.user.id, oldAttendance, null);
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Attendance record deleted successfully')
  );
});
