import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';
import { sendMarkFinalizationAlert } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';
import { createNotification } from './notifications.controller';
import * as reportsService from '../services/reports.service';

const getMidnightUTCDate = (dateVal: string | Date | undefined | null): Date => {
  if (!dateVal) {
    return new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');
  }
  const dStr = typeof dateVal === 'string' ? dateVal.split('T')[0] : new Date(dateVal).toISOString().split('T')[0];
  return new Date(`${dStr}T00:00:00.000Z`);
};

export const getMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, subject, examType, className, section } = req.query;
  const whereClause: Prisma.MarkWhereInput = {};
  
  if (studentId) whereClause.studentId = Number(studentId);
  if (subject) whereClause.subject = subject as string;
  if (examType) whereClause.examType = examType as string;
  
  if (className || section) {
    whereClause.student = {};
    if (className) whereClause.student.className = className as string;
    if (section) whereClause.student.section = section as string;
  }
  
  const marks = await prisma.mark.findMany({ 
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
    new ApiResponse(200, marks, 'Marks fetched successfully')
  );
});

export const bulkCreateMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { records } = req.body as { 
    records: { 
      studentId: number | string, 
      subject: string, 
      examType: string, 
      score: number | string, 
      maxScore: number | string, 
      date: string 
    }[] 
  };

  if (!records || !Array.isArray(records)) {
    throw new ApiError(400, 'Marks records array is required');
  }

  const results = await prisma.$transaction(
    records.map((record) => {
      const { studentId, subject, examType, score, maxScore, date } = record;
      const markDate = getMidnightUTCDate(date);
      
      return prisma.mark.upsert({
        where: {
          studentId_subject_examType_date: {
            studentId: Number(studentId),
            subject,
            examType,
            date: markDate,
          },
        },
        update: {
          score: Number(score),
          maxScore: Number(maxScore) || 100,
        },
        create: {
          studentId: Number(studentId),
          subject,
          examType,
          score: Number(score),
          maxScore: Number(maxScore) || 100,
          date: markDate,
        },
      });
    })
  );

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Mark', 'BULK', req.user.id, null, { count: results.length, records });
  }

  return res.status(200).json(
    new ApiResponse(200, results, 'Bulk marks processed successfully')
  );
});

export const getMarkById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const mark = await prisma.mark.findUnique({ where: { id: Number(id) } });
  
  if (!mark) {
    throw new ApiError(404, 'Mark not found');
  }

  return res.status(200).json(
    new ApiResponse(200, mark, 'Mark fetched successfully')
  );
});

export const createMark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId, subject, examType, score, maxScore, date } = req.body;
  
  if (!studentId || !subject || !examType || score === undefined) {
    throw new ApiError(400, 'Student ID, subject, exam type and score are required');
  }

  const markDate = getMidnightUTCDate(date);

  const mark = await prisma.mark.create({
    data: {
      studentId: Number(studentId),
      subject,
      examType,
      score: Number(score),
      maxScore: Number(maxScore) || 100,
      date: markDate,
    },
  });

  if (req.user) {
    await AuditService.logChange('CREATE', 'Mark', mark.id, req.user.id, null, mark);
  }
  return res.status(201).json(
    new ApiResponse(201, mark, 'Mark created successfully')
  );
});

export const updateMark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { subject, examType, score, maxScore, date } = req.body;

  const oldMark = await prisma.mark.findUnique({
    where: { id: Number(id) }
  });

  if (!oldMark) {
    throw new ApiError(404, 'Mark not found');
  }

  const markDate = date ? getMidnightUTCDate(date) : undefined;

  const mark = await prisma.mark.update({
    where: { id: Number(id) },
    data: {
      subject,
      examType,
      score: score !== undefined ? Number(score) : undefined,
      maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
      date: markDate,
    },
  });

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Mark', id, req.user.id, oldMark, mark);
  }

  return res.status(200).json(
    new ApiResponse(200, mark, 'Mark updated successfully')
  );
});

export const deleteMark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const oldMark = await prisma.mark.findUnique({
    where: { id: Number(id) }
  });

  if (!oldMark) {
    throw new ApiError(404, 'Mark not found');
  }

  await prisma.mark.delete({
    where: { id: Number(id) },
  });

  if (req.user) {
    await AuditService.logChange('DELETE', 'Mark', id, req.user.id, oldMark, null);
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Mark deleted successfully')
  );
});

export const finalizeMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, examType, date } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = getMidnightUTCDate(date);

  const markLock = await prisma.markLock.upsert({
    where: {
      className_subject_examType_date: { className, subject, examType, date: lockDate }
    },
    update: {
      lockedAt: new Date(),
      lockedBy: user.id
    },
    create: {
      className,
      subject,
      examType,
      date: lockDate,
      lockedBy: user.id
    }
  });

  await AuditService.logChange('UPDATE', 'MarkLock', `${className}-${subject}-${examType}`, user.id, null, markLock);

  // Notify Admins
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: 'Marks Finalized',
      message: `Exam marks for ${subject} (${examType}) in Class ${className} have been locked by ${user.name || user.email}.`,
      type: 'SUCCESS',
      link: '/marks'
    });
  }

  // Trigger email notification
  sendMarkFinalizationAlert(className, subject, examType, user.name || user.email);

  // Trigger Report Generation for affected students
  const students = await prisma.student.findMany({
    where: { className }
  });

  for (const student of students) {
    await reportsService.generateOrUpdateReport(student.id, examType);
  }

  return res.status(200).json(
    new ApiResponse(200, markLock, 'Marks finalized and reports updated successfully')
  );
});

export const unlockMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, examType, date } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (user.role !== 'ADMIN') {
    throw new ApiError(403, 'Only administrators can unlock marks');
  }

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = getMidnightUTCDate(date);

  const oldLock = await prisma.markLock.findUnique({
    where: {
      className_subject_examType_date: { className, subject, examType, date: lockDate }
    }
  });

  await prisma.markLock.delete({
    where: {
      className_subject_examType_date: { className, subject, examType, date: lockDate }
    }
  });

  await AuditService.logChange('DELETE', 'MarkLock', `${className}-${subject}-${examType}`, user.id, oldLock, null);

  return res.status(200).json(
    new ApiResponse(200, null, 'Marks unlocked successfully')
  );
});

export const checkMarkLock = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, examType, date } = req.query;

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = getMidnightUTCDate(date as string);

  const markLock = await prisma.markLock.findUnique({
    where: {
      className_subject_examType_date: { 
        className: className as string, 
        subject: subject as string, 
        examType: examType as string,
        date: lockDate
      }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, { isLocked: !!markLock, lockDetails: markLock }, 'Lock status fetched')
  );
});
