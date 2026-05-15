import { Request, Response } from 'express';
import { generatePerformanceInsights, generateQuestions as generateQuestionsService } from '../services/ai.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const { marks, attendance } = req.body;
  
  if (!marks || !attendance) {
    throw new ApiError(400, 'Marks and attendance data are required');
  }

  const insights = await generatePerformanceInsights(marks, attendance);
  
  return res.status(200).json(
    new ApiResponse(200, { result: insights }, 'Insights generated successfully')
  );
});

export const generateQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { className, subject, topic, difficulty, count } = req.body;
  
  if (!className || !subject || !topic || !difficulty) {
    throw new ApiError(400, 'Class, subject, topic, and difficulty are required');
  }

  const questions = await generateQuestionsService(className, subject, topic, difficulty, count);
  
  return res.status(200).json(
    new ApiResponse(200, questions, 'Questions generated successfully')
  );
});
