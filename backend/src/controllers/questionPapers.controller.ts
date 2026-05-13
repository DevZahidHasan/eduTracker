import { Response } from 'express';
import { questionPaperService } from '../services/questionPapers.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth.middleware';

export const getQuestionPapers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const papers = await questionPaperService.getAllQuestionPapers();
  res.status(200).json(new ApiResponse(200, papers, 'Question papers retrieved successfully'));
});

export const getQuestionPaperById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const paper = await questionPaperService.getQuestionPaperById(id);
  
  if (!paper) {
    throw new ApiError(404, 'Question paper not found');
  }
  
  res.status(200).json(new ApiResponse(200, paper, 'Question paper retrieved successfully'));
});

export const createQuestionPaper = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const paper = await questionPaperService.createQuestionPaper(req.body, userId);
  res.status(201).json(new ApiResponse(201, paper, 'Question paper created successfully'));
});

export const updateQuestionPaper = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const paper = await questionPaperService.updateQuestionPaper(id, req.body);
  res.status(200).json(new ApiResponse(200, paper, 'Question paper updated successfully'));
});

export const deleteQuestionPaper = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await questionPaperService.deleteQuestionPaper(id);
  res.status(200).json(new ApiResponse(200, null, 'Question paper deleted successfully'));
});
