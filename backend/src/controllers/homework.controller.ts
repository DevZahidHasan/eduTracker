import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { createNotification } from './notifications.controller';

/**
 * Create a new homework assignment
 */
export const createHomework = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, section, subjectName, title, description, dueDate } = req.body;
  const teacherId = req.user?.id;

  if (!className || !section || !subjectName || !title || !description || !dueDate) {
    throw new ApiError(400, 'All fields are required');
  }

  const homework = await prisma.homework.create({
    data: {
      className,
      section,
      subjectName,
      teacherId: Number(teacherId),
      title,
      description,
      dueDate: new Date(dueDate)
    }
  });

  // Notify all students/parents in this class section
  const students = await prisma.student.findMany({
    where: { className, section },
    select: { parentId: true }
  });

  const parentIds = Array.from(new Set(students.map(s => s.parentId).filter(id => id !== null))) as number[];

  for (const parentId of parentIds) {
    await createNotification({
      userId: parentId,
      title: 'New Homework Assigned',
      message: `A new ${subjectName} homework "${title}" has been assigned for Class ${className}-${section}.`,
      type: 'INFO',
      link: `/homework`
    });
  }

  return res.status(201).json(
    new ApiResponse(201, homework, 'Homework created successfully and parents notified')
  );
});

/**
 * Get homeworks for a specific class section
 */
export const getHomeworks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, section } = req.query;

  const where: any = {};
  if (className) where.className = className as string;
  if (section) where.section = section as string;

  const homeworks = await prisma.homework.findMany({
    where,
    include: {
      teacher: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(
    new ApiResponse(200, homeworks, 'Homeworks fetched successfully')
  );
});

/**
 * Get homeworks for a parent's children
 */
export const getParentHomeworks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parentId = req.user?.id;

  const students = await prisma.student.findMany({
    where: { parentId },
    select: { className: true, section: true }
  });

  if (students.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], 'No students found'));
  }

  const homeworks = await prisma.homework.findMany({
    where: {
      OR: students.map(s => ({
        className: s.className,
        section: s.section
      }))
    },
    include: {
      teacher: {
        select: { name: true }
      }
    },
    orderBy: { dueDate: 'asc' }
  });

  return res.status(200).json(
    new ApiResponse(200, homeworks, 'Homeworks fetched successfully')
  );
});

/**
 * Update homework
 */
export const updateHomework = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;
  const teacherId = req.user?.id;

  const homework = await prisma.homework.findUnique({ where: { id: Number(id) } });

  if (!homework) {
    throw new ApiError(404, 'Homework not found');
  }

  if (homework.teacherId !== teacherId && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'Unauthorized to update this homework');
  }

  const updatedHomework = await prisma.homework.update({
    where: { id: Number(id) },
    data: {
      title: title || homework.title,
      description: description || homework.description,
      dueDate: dueDate ? new Date(dueDate) : homework.dueDate
    }
  });

  return res.status(200).json(
    new ApiResponse(200, updatedHomework, 'Homework updated successfully')
  );
});

/**
 * Delete homework
 */
export const deleteHomework = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const teacherId = req.user?.id;

  const homework = await prisma.homework.findUnique({ where: { id: Number(id) } });

  if (!homework) {
    throw new ApiError(404, 'Homework not found');
  }

  if (homework.teacherId !== teacherId && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'Unauthorized to delete this homework');
  }

  await prisma.homework.delete({ where: { id: Number(id) } });

  return res.status(200).json(
    new ApiResponse(200, null, 'Homework deleted successfully')
  );
});
