import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getBankQuestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, chapter } = req.query;

  const filters: any = {};
  if (className) filters.className = className;
  if (subject) filters.subject = subject;
  if (chapter) filters.chapter = chapter;

  const questions = await prisma.bankQuestion.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(new ApiResponse(200, questions, 'Questions retrieved successfully'));
});

export const getBankQuestionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const question = await prisma.bankQuestion.findUnique({
    where: { id: req.params.id },
  });

  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  res.status(200).json(new ApiResponse(200, question, 'Question retrieved successfully'));
});

export const createBankQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject, chapter, questionType, questionText, marks, options, correctAnswer } = req.body;

  const newQuestion = await prisma.bankQuestion.create({
    data: {
      className,
      subject,
      chapter,
      questionType,
      questionText,
      marks,
      options: options || [],
      correctAnswer,
    },
  });

  res.status(201).json(new ApiResponse(201, newQuestion, 'Question added to bank successfully'));
});

export const updateBankQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const question = await prisma.bankQuestion.update({
    where: { id },
    data,
  });

  res.status(200).json(new ApiResponse(200, question, 'Question updated successfully'));
});

export const deleteBankQuestion = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.bankQuestion.delete({
    where: { id: req.params.id },
  });

  res.status(200).json(new ApiResponse(200, null, 'Question deleted successfully'));
});
