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

  // Map to the format the frontend expects (value/label)
  const config = {
    classes: classes.map(c => ({ value: c.name, label: formatLabel(c.name) })),
    subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
    examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name) }))
  };

  return res.status(200).json(
    new ApiResponse(200, config, 'Configuration fetched successfully')
  );
});

function formatLabel(str: string): string {
  // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
