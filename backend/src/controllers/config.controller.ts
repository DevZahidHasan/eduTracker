import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';

export const getConfig = asyncHandler(async (req: Request, res: Response) => {
  const classes = await prisma.schoolClass.findMany({
    orderBy: { name: 'asc' }
  });
  
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' }
  });
  
  const examTypes = await prisma.examType.findMany({
    orderBy: { name: 'asc' }
  });

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  // Map to the format the frontend expects (value/label)
  const config = {
    classes: classes.map(c => ({ value: c.name, label: formatLabel(c.name) })),
    subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
    examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name), baseMark: e.baseMark })),
    teachers: teachers.map(t => ({ value: t.id.toString(), label: t.name || t.email }))
  };

  return res.status(200).json(
    new ApiResponse(200, config, 'Configuration fetched successfully')
  );
});

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const newClass = await prisma.schoolClass.create({
    data: { name: name.toUpperCase().replace(/\s+/g, '_') }
  });
  return res.status(201).json(new ApiResponse(201, newClass, 'Class created successfully'));
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const subject = await prisma.subject.create({
    data: { name: name.toUpperCase().replace(/\s+/g, '_') }
  });
  return res.status(201).json(new ApiResponse(201, subject, 'Subject created successfully'));
});

export const createExamType = asyncHandler(async (req: Request, res: Response) => {
  const { name, baseMark } = req.body;
  const examType = await prisma.examType.create({
    data: { 
      name: name.toUpperCase().replace(/\s+/g, '_'),
      baseMark: baseMark ? Number(baseMark) : 100
    }
  });
  return res.status(201).json(new ApiResponse(201, examType, 'Exam type created successfully'));
});

export const updateExamType = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;
  const { baseMark } = req.body;
  
  const examType = await prisma.examType.update({
    where: { name },
    data: { baseMark: Number(baseMark) }
  });
  
  return res.status(200).json(new ApiResponse(200, examType, 'Exam type updated successfully'));
});

function formatLabel(str: string): string {
  // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
