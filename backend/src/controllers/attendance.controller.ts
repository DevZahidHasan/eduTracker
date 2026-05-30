import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma, AttendanceStatus } from '@prisma/client';
import { sendParentAttendanceNotification } from '../services/email.service';
import { sendParentAttendanceWhatsApp } from '../services/whatsapp.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';
import { createNotification } from './notifications.controller';

const getMidnightUTCDate = (dateVal: string | Date | undefined | null): Date => {
  if (!dateVal) {
    return new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');
  }
  const dStr = typeof dateVal === 'string' ? dateVal.split('T')[0] : new Date(dateVal).toISOString().split('T')[0];
  return new Date(`${dStr}T00:00:00.000Z`);
};

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

  if (!records || !Array.isArray(records) || records.length === 0) {
    throw new ApiError(400, 'Attendance records array is required and cannot be empty');
  }

  // Get the first student to find class and section
  const firstStudentId = Number(records[0].studentId);
  const studentInfo = await prisma.student.findUnique({
    where: { id: firstStudentId },
    select: { className: true, section: true }
  });

  if (!studentInfo) {
    throw new ApiError(404, 'Student not found');
  }
  
  const attendanceDate = getMidnightUTCDate(records[0].date);

  // Check if attendance is locked for this class/section/date
  const existingLock = await prisma.attendanceLock.findUnique({
    where: {
      className_section_date: {
        className: studentInfo.className,
        section: studentInfo.section,
        date: attendanceDate
      }
    }
  });

  const userRole = req.user?.role;
  if (existingLock && userRole !== 'ADMIN' && userRole !== 'PRINCIPAL') {
    throw new ApiError(403, 'Attendance for this section is locked and can only be updated by Admin or Principal');
  }

  // Check if all students in this section are included
  const sectionStudents = await prisma.student.findMany({
    where: {
      className: studentInfo.className,
      section: studentInfo.section
    },
    select: { id: true }
  });

  // Verify that every student in the section is in the records
  const recordStudentIds = new Set(records.map(r => Number(r.studentId)));
  const missingStudents = sectionStudents.filter(s => !recordStudentIds.has(s.id));

  if (missingStudents.length > 0) {
    throw new ApiError(400, `All students in the section must be marked. Missing ${missingStudents.length} student(s).`);
  }

  // Use a transaction to ensure all or nothing
  const results = await prisma.$transaction(
    records.map((record) => {
      const { studentId, status } = record;

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

  // Lock the attendance for this section/date if not already locked
  if (!existingLock && req.user) {
    await prisma.attendanceLock.create({
      data: {
        className: studentInfo.className,
        section: studentInfo.section,
        date: attendanceDate,
        lockedBy: req.user.id
      }
    });
  }

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Attendance', 'BULK', req.user.id, null, { count: results.length, records });
  }

  // Trigger parent notifications in background
  results.forEach(record => {
    sendParentAttendanceNotification(record.id).catch(err => 
      console.error(`Failed to send email for attendance ${record.id}:`, err)
    );
    sendParentAttendanceWhatsApp(record.id).catch(err => 
      console.error(`Failed to send WhatsApp for attendance ${record.id}:`, err)
    );
  });

  // Notify Admins about bulk update
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: 'Bulk Attendance Update',
      message: `${results.length} attendance records were processed by ${req.user?.name || 'a staff member'}.`,
      type: 'INFO',
      link: '/attendance'
    });
  }

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

export const getAttendanceLockStatus = asyncHandler(async (req: Request, res: Response) => {
  const { className, section, date } = req.query;

  if (!className || !section || !date) {
    throw new ApiError(400, 'className, section, and date are required');
  }

  const attendanceDate = getMidnightUTCDate(date as string);

  const lock = await prisma.attendanceLock.findUnique({
    where: {
      className_section_date: {
        className: className as string,
        section: section as string,
        date: attendanceDate
      }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, { isLocked: !!lock, lockData: lock }, 'Lock status fetched successfully')
  );
});

export const unlockAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, section, date } = req.body;

  if (!className || !section || !date) {
    throw new ApiError(400, 'className, section, and date are required');
  }

  const userRole = req.user?.role;
  if (userRole !== 'ADMIN' && userRole !== 'PRINCIPAL') {
    throw new ApiError(403, 'Only Admins and Principals can unlock attendance');
  }

  const attendanceDate = getMidnightUTCDate(date as string);

  const lock = await prisma.attendanceLock.findUnique({
    where: {
      className_section_date: {
        className: className as string,
        section: section as string,
        date: attendanceDate
      }
    }
  });

  if (!lock) {
    throw new ApiError(404, 'Attendance is not locked for this section on this date');
  }

  await prisma.attendanceLock.delete({
    where: {
      id: lock.id
    }
  });

  if (req.user) {
    await AuditService.logChange('DELETE', 'AttendanceLock', lock.id.toString(), req.user.id, lock, null);
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Attendance unlocked successfully')
  );
});
