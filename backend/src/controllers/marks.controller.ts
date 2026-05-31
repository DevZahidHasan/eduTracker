import { Request, Response } from 'express';
import prisma from '../prisma';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';
import { createNotification } from './notifications.controller';
import { sendMarkFinalizationAlert } from '../services/email.service';

export const getMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, subject, examType, className, section, year } = req.query;
  const whereClause: any = {};

  if (studentId) whereClause.studentId = Number(studentId);
  if (subject) whereClause.subject = subject as string;
  if (examType) whereClause.examType = examType as string;
  if (year) whereClause.year = Number(year);

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
          studentId: true,
          className: true
        }
      }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, marks, 'Marks fetched successfully')
  );
});

async function isMarkLocked(className: string, subject: string, examType: string, year: number) {
  const lock = await prisma.markLock.findUnique({
    where: {
      className_subject_examType_year: { className, subject, examType, year }
    }
  });
  return !!lock;
}

export const bulkCreateMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { records } = req.body as {
    records: {
      studentId: number | string,
      subject: string,
      examType: string,
      score: number | string,
      maxScore: number | string,
      date: string,
      year: number | string
    }[]
  };

  if (!records || !Array.isArray(records)) {
    throw new ApiError(400, 'Marks records array is required');
  }

  // Check locks for all affected class/subject/exam/year combinations
  for (const record of records) {
    const student = await prisma.student.findUnique({
      where: { id: Number(record.studentId) },
      select: { className: true }
    });
    
    if (!student) throw new ApiError(404, `Student with ID ${record.studentId} not found`);
    
    const year = Number(record.year || new Date().getFullYear());
    if (await isMarkLocked(student.className, record.subject, record.examType, year)) {
      throw new ApiError(403, `Marks are locked for ${student.className}, ${record.subject}, ${record.examType} in year ${year}`);
    }
  }

  const results = await prisma.$transaction(
    records.map((record) => {
      const { studentId, subject, examType, score, maxScore, date, year } = record;
      const markDate = new Date(date || new Date());
      const markYear = Number(year || markDate.getFullYear());
      
      return prisma.mark.upsert({
        where: {
          studentId_subject_examType_year: {
            studentId: Number(studentId),
            subject,
            examType,
            year: markYear,
          },
        },
        update: {
          score: Number(score),
          maxScore: Number(maxScore) || 100,
          date: markDate,
        },
        create: {
          studentId: Number(studentId),
          subject,
          examType,
          score: Number(score),
          maxScore: Number(maxScore) || 100,
          date: markDate,
          year: markYear,
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
  const { studentId, subject, examType, score, maxScore, date, year } = req.body;

  if (!studentId || !subject || !examType || score === undefined) {
    throw new ApiError(400, 'Student ID, subject, exam type and score are required');
  }

  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    select: { className: true }
  });
  if (!student) throw new ApiError(404, 'Student not found');

  const markDate = new Date(date || new Date());
  const markYear = Number(year || markDate.getFullYear());

  if (await isMarkLocked(student.className, subject, examType, markYear)) {
    throw new ApiError(403, 'Marks are locked for this year');
  }

  const mark = await prisma.mark.create({
    data: {
      studentId: Number(studentId),
      subject,
      examType,
      score: Number(score),
      maxScore: Number(maxScore) || 100,
      date: markDate,
      year: markYear,
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
  const { subject, examType, score, maxScore, date, year } = req.body;

  const oldMark = await prisma.mark.findUnique({
    where: { id: Number(id) },
    include: { student: true }
  });

  if (!oldMark) {
    throw new ApiError(404, 'Mark not found');
  }

  const markDate = date ? new Date(date) : oldMark.date;
  const markYear = year ? Number(year) : oldMark.year;

  if (await isMarkLocked(oldMark.student.className, subject || oldMark.subject, examType || oldMark.examType, markYear)) {
    throw new ApiError(403, 'Marks are locked for this year');
  }

  const updatedMark = await prisma.mark.update({
    where: { id: Number(id) },
    data: {
      subject,
      examType,
      score: score !== undefined ? Number(score) : undefined,
      maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
      date: markDate,
      year: markYear,
    },
  });

  if (req.user) {
    await AuditService.logChange('UPDATE', 'Mark', id, req.user.id, oldMark, updatedMark);
  }

  return res.status(200).json(
    new ApiResponse(200, updatedMark, 'Mark updated successfully')
  );
});

export const deleteMark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const oldMark = await prisma.mark.findUnique({
    where: { id: Number(id) },
    include: { student: true }
  });

  if (!oldMark) {
    throw new ApiError(404, 'Mark not found');
  }

  if (await isMarkLocked(oldMark.student.className, oldMark.subject, oldMark.examType, oldMark.year)) {
    throw new ApiError(403, 'Marks are locked for this year');
  }

  await prisma.mark.delete({
    where: { id: Number(id) }
  });

  if (req.user) {
    await AuditService.logChange('DELETE', 'Mark', id, req.user.id, oldMark, null);
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Mark deleted successfully')
  );
});

export const finalizeMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, examType, year } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!className || !subject || !examType || !year) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Year are required');
  }

  const lockYear = Number(year);

  const markLock = await prisma.markLock.upsert({
    where: {
      className_subject_examType_year: { className, subject, examType, year: lockYear }
    },
    update: {
      lockedAt: new Date(),
      lockedBy: user.id
    },
    create: {
      className,
      subject,
      examType,
      year: lockYear,
      lockedBy: user.id
    }
  });

  await AuditService.logChange('UPDATE', 'MarkLock', `${className}-${subject}-${examType}-${lockYear}`, user.id, null, markLock);

  // Notify Admins
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: 'Marks Finalized',
      message: `Exam marks for ${subject} (${examType}) in Class ${className} for ${lockYear} have been locked by ${user.name || user.email}.`,
      type: 'SUCCESS',
      link: '/marks'
    });
  }

  // Trigger email notification
  sendMarkFinalizationAlert(className, subject, examType, user.name || user.email);

  return res.status(200).json(
    new ApiResponse(200, markLock, 'Marks finalized and locked successfully')
  );
});

export const unlockMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, examType, year } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (user.role !== 'ADMIN') {
    throw new ApiError(403, 'Only administrators can unlock marks');
  }

  if (!className || !subject || !examType || !year) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Year are required');
  }

  const lockYear = Number(year);

  const oldLock = await prisma.markLock.findUnique({
    where: {
      className_subject_examType_year: { className, subject, examType, year: lockYear }
    }
  });

  await prisma.markLock.delete({
    where: {
      className_subject_examType_year: { className, subject, examType, year: lockYear }
    }
  });

  await AuditService.logChange('DELETE', 'MarkLock', `${className}-${subject}-${examType}-${lockYear}`, user.id, oldLock, null);

  return res.status(200).json(
    new ApiResponse(200, null, 'Marks unlocked successfully')
  );
});

export const checkMarkLock = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, examType, year } = req.query;

  if (!className || !subject || !examType || !year) {
    throw new ApiError(400, 'Class, Subject, Exam Type and Year are required');
  }

  const lockYear = Number(year);

  const markLock = await prisma.markLock.findUnique({
    where: {
      className_subject_examType_year: { 
        className: className as string, 
        subject: subject as string, 
        examType: examType as string,
        year: lockYear
      }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, { isLocked: !!markLock, lockDetails: markLock }, 'Lock status fetched')
  );
});
