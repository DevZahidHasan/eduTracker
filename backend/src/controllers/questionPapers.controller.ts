import { Response } from 'express';
import { questionPaperService } from '../services/questionPapers.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { generateQuestionPaperHtml } from '../utils/questionPaperHtmlGenerator';
import { generatePdfFromHtml } from '../utils/pdfGenerator';

export const getQuestionPapers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { isTemplate, className, subject } = req.query;
  
  const filters = {
    isTemplate: isTemplate === 'true' ? true : isTemplate === 'false' ? false : undefined,
    className: className as string,
    subject: subject as string,
  };

  const papers = await questionPaperService.getAllQuestionPapers(filters);
  res.status(200).json(new ApiResponse(200, papers, 'Question papers retrieved successfully'));
});

export const getTemplates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { className, subject } = req.query;
  
  const filters = {
    isTemplate: true,
    className: className as string,
    subject: subject as string,
  };

  const templates = await questionPaperService.getAllQuestionPapers(filters);
  res.status(200).json(new ApiResponse(200, templates, 'Templates retrieved successfully'));
});

export const duplicateQuestionPaper = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isTemplate, title } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new ApiError(401, 'Unauthorized');

  const paper = await questionPaperService.duplicateQuestionPaper(id, userId, { isTemplate, title });
  res.status(201).json(new ApiResponse(201, paper, 'Question paper duplicated successfully'));
});

export const getQuestionPaperById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const paper = await questionPaperService.getQuestionPaperById(id);
  
  if (!paper) {
    throw new ApiError(404, 'Question paper not found');
  }
  
  res.status(200).json(new ApiResponse(200, paper, 'Question paper retrieved successfully'));
});

export const printQuestionPaper = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const paper = await questionPaperService.getQuestionPaperById(id);
  
  if (!paper) {
    throw new ApiError(404, 'Question paper not found');
  }

  const schoolProfile = await prisma.schoolProfile.findFirst();
  const schoolName = schoolProfile?.name || 'EduTrack Academy';

  const html = generateQuestionPaperHtml(paper, schoolName);

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export const exportPdf = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const paper = await questionPaperService.getQuestionPaperById(id);
  
  if (!paper) {
    throw new ApiError(404, 'Question paper not found');
  }

  const schoolProfile = await prisma.schoolProfile.findFirst();
  const schoolName = schoolProfile?.name || 'EduTrack Academy';

  const html = generateQuestionPaperHtml(paper, schoolName);
  
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="question_paper_${id}.pdf"`);
  res.send(pdfBuffer);
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
