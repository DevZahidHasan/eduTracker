import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getMarks = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.query;
  const whereClause = studentId ? { studentId: Number(studentId) } : {};
  const marks = await prisma.mark.findMany({ where: whereClause });
  
  return res.status(200).json(
    new ApiResponse(200, marks, 'Marks fetched successfully')
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
  const { studentId, subject, score, maxScore, date } = req.body;
  
  if (!studentId || !subject || score === undefined) {
    throw new ApiError(400, 'Student ID, subject and score are required');
  }

  const mark = await prisma.mark.create({
    data: {
      studentId,
      subject,
      score,
      maxScore: maxScore || 100,
      date: date ? new Date(date) : undefined,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, mark, 'Mark created successfully')
  );
});

export const updateMark = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, score, maxScore, date } = req.body;

  const mark = await prisma.mark.update({
    where: { id: Number(id) },
    data: {
      subject,
      score,
      maxScore,
      date: date ? new Date(date) : undefined,
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
