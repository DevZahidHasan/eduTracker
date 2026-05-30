import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

// Trigger nodemon restart
export const getConfig = asyncHandler(async (req: Request, res: Response) => {
  const classes = await prisma.schoolClass.findMany({
    include: { sections: true },
    orderBy: { name: 'asc' }
  });
  
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' }
  });
  
  const examTypes = await prisma.examType.findMany({
    orderBy: { name: 'asc' }
  });

  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' }
  });

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  // Map to the format the frontend expects (value/label)
  const config = {
    classes: classes.map(c => ({ 
      value: c.name, 
      label: formatLabel(c.name),
      sections: c.sections.map(s => ({ value: s.section, label: s.section }))
    })),
    subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
    examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name), baseMark: e.baseMark })),
    roles: roles.map(r => ({ value: r.name, label: formatLabel(r.name) })),
    teachers: teachers.map(t => ({ value: t.id.toString(), label: t.name || t.email }))
  };

  return res.status(200).json(
    new ApiResponse(200, config, 'Configuration fetched successfully')
  );
});

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const className = name.toUpperCase().replace(/\s+/g, '_');
  
  const newClass = await prisma.schoolClass.create({
    data: { 
      name: className,
      sections: {
        create: { section: 'A' }
      }
    },
    include: { sections: true }
  });
  
  return res.status(201).json(new ApiResponse(201, newClass, 'Class created successfully with default Section A'));
});

export const createSection = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.body;
  
  if (!className || !section) {
    throw new ApiError(400, 'Class name and section are required');
  }

  const newSection = await prisma.classSection.create({
    data: { 
      className: className.toUpperCase().replace(/\s+/g, '_'),
      section: section.toUpperCase().trim()
    }
  });
  
  return res.status(201).json(new ApiResponse(201, newSection, 'Section created successfully'));
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const subject = await prisma.subject.create({
    data: { name: name.toUpperCase().replace(/\s+/g, '_') }
  });
  return res.status(201).json(new ApiResponse(201, subject, 'Subject created successfully'));
});

export const createExamType = asyncHandler(async (req: Request, res: Response) => {
  const { name, baseMark, weightage, isFinal, category, termNumber } = req.body;
  const examType = await prisma.examType.create({
    data: { 
      name: name.toUpperCase().replace(/\s+/g, '_'),
      baseMark: baseMark ? Number(baseMark) : 100,
      weightage: weightage ? Number(weightage) : 100,
      isFinal: isFinal === true,
      category: category || 'FINAL',
      termNumber: termNumber ? Number(termNumber) : 1
    }
  });
  return res.status(201).json(new ApiResponse(201, examType, 'Exam type created successfully'));
});

export const updateExamType = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;
  const { baseMark, weightage, isFinal, category, termNumber } = req.body;
  
  const examType = await prisma.examType.update({
    where: { name },
    data: { 
      baseMark: baseMark !== undefined ? Number(baseMark) : undefined,
      weightage: weightage !== undefined ? Number(weightage) : undefined,
      isFinal: isFinal !== undefined ? isFinal : undefined,
      category: category !== undefined ? category : undefined,
      termNumber: termNumber !== undefined ? Number(termNumber) : undefined
    }
  });
  
  return res.status(200).json(new ApiResponse(200, examType, 'Exam type updated successfully'));
});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;
  
  // Safe Delete: Check if students exist in this class
  const studentCount = await prisma.student.count({ where: { className: name } });
  if (studentCount > 0) {
    throw new ApiError(400, `Cannot delete class '${name}' because it contains ${studentCount} students. Please reassign or delete the students first.`);
  }

  await prisma.$transaction(async (tx) => {
    // Clean up empty sections and fee structures
    await tx.classSection.deleteMany({ where: { className: name } });
    await tx.feeStructure.deleteMany({ where: { className: name } });
    await tx.schoolClass.delete({ where: { name } });
  });

  return res.status(200).json(new ApiResponse(200, null, 'Class deleted successfully'));
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.params;
  
  // Safe Delete: Check if students exist in this section
  const studentCount = await prisma.student.count({ where: { className, section } });
  if (studentCount > 0) {
    throw new ApiError(400, `Cannot delete Section '${section}' because it contains ${studentCount} students.`);
  }
  
  await prisma.classSection.delete({
    where: {
      className_section: { className, section }
    }
  });

  return res.status(200).json(new ApiResponse(200, null, 'Section deleted successfully'));
});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;
  
  // Safe Delete: Check if marks exist for this subject
  const markCount = await prisma.mark.count({ where: { subject: name } });
  if (markCount > 0) {
    throw new ApiError(400, `Cannot delete subject '${name}' because it has ${markCount} recorded marks. Delete the marks first.`);
  }

  await prisma.subject.delete({ where: { name } });

  return res.status(200).json(new ApiResponse(200, null, 'Subject deleted successfully'));
});

export const deleteExamType = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;
  
  // Safe Delete: Check if marks or results exist
  const markCount = await prisma.mark.count({ where: { examType: name } });
  if (markCount > 0) {
    throw new ApiError(400, `Cannot delete '${name}' because it has ${markCount} recorded marks.`);
  }

  await prisma.examType.delete({ where: { name } });

  return res.status(200).json(new ApiResponse(200, null, 'Exam type deleted successfully'));
});

export function formatLabel(str: string): string {
  // Only transform if it looks like an UPPER_CASE_CONSTANT
  if (!str.includes('_') && str !== str.toUpperCase()) return str;
  
  // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
