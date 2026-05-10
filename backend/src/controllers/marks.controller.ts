import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';
import { sendMarkFinalizationAlert } from '../services/email.service';

export const getMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, subject, examType, className } = req.query;
  const whereClause: Prisma.MarkWhereInput = {};
  
  if (studentId) whereClause.studentId = Number(studentId);
  if (subject) whereClause.subject = subject as string;
  if (examType) whereClause.examType = examType as string;
  
  if (className) {
    whereClause.student = {
      className: className as string
    };
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

export const bulkCreateMarks = asyncHandler(async (req: Request, res: Response) => {
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
      const markDate = new Date(date || new Date());
      markDate.setHours(0, 0, 0, 0);
      
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

export const createMark = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, subject, examType, score, maxScore, date } = req.body;
  
  if (!studentId || !subject || !examType || score === undefined) {
    throw new ApiError(400, 'Student ID, subject, exam type and score are required');
  }

  const markDate = new Date(date || new Date());
  markDate.setHours(0, 0, 0, 0);

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

  return res.status(201).json(
    new ApiResponse(201, mark, 'Mark created successfully')
  );
});

export const updateMark = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, examType, score, maxScore, date } = req.body;

  const markDate = date ? new Date(date) : undefined;
  if (markDate) markDate.setHours(0, 0, 0, 0);

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

  return res.status(200).json(
    new ApiResponse(200, mark, 'Mark updated successfully')
  );
});

export const deleteMark = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.mark.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Mark deleted successfully')
  );
});

export const finalizeMarks = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, examType, date } = req.body;
  const user = (req as any).user;

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = new Date(date);
  lockDate.setHours(0, 0, 0, 0);

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

  // Trigger email notification
  sendMarkFinalizationAlert(className, subject, examType, user.name || user.email);

  return res.status(200).json(
    new ApiResponse(200, markLock, 'Marks finalized and locked successfully')
  );
});

export const unlockMarks = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, examType, date } = req.body;
  const user = (req as any).user;

  if (user.role !== 'ADMIN') {
    throw new ApiError(403, 'Only administrators can unlock marks');
  }

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = new Date(date);
  lockDate.setHours(0, 0, 0, 0);

  await prisma.markLock.delete({
    where: {
      className_subject_examType_date: { className, subject, examType, date: lockDate }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Marks unlocked successfully')
  );
});

export const checkMarkLock = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, examType, date } = req.query;

  if (!className || !subject || !examType || !date) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Date are required');
  }

  const lockDate = new Date(date as string);
  lockDate.setHours(0, 0, 0, 0);

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
