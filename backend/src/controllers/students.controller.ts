import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuditService } from '../services/audit.service';

export const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const { className } = req.query;
  const where: Prisma.StudentWhereInput = {};
  
  if (className) {
    where.className = className as string;
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: {
      rollNumber: 'asc'
    }
  });
  
  return res.status(200).json(
    new ApiResponse(200, students, 'Students fetched successfully')
  );
});

export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: { marks: true, attendances: true },
  });

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return res.status(200).json(
    new ApiResponse(200, student, 'Student fetched successfully')
  );
});

export const uploadStudentPhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(200, { imageUrl }, 'Student photo uploaded successfully')
  );
});

const toBool = (val: any) => {
  if (val === true || val === 'true' || val === 1 || val === '1') return true;
  if (val === false || val === 'false' || val === 0 || val === '0') return false;
  return undefined;
};

export const generateStudentCredentials = asyncHandler(async (req: Request, res: Response) => {
  const { className, section } = req.query;

  if (!className || !section) {
    throw new ApiError(400, 'Class and Section are required to generate credentials');
  }

  // 1. Generate Next Roll Number for the specific Class and Section
  const studentsInSection = await prisma.student.findMany({
    where: {
      className: className as string,
      section: section as string,
    },
    select: { rollNumber: true },
  });

  let nextRollNumber = 1;
  if (studentsInSection.length > 0) {
    // Extract numeric parts of roll numbers to find the max
    const rollNumbers = studentsInSection
      .map(s => parseInt(s.rollNumber, 10))
      .filter(n => !isNaN(n));
      
    if (rollNumbers.length > 0) {
      nextRollNumber = Math.max(...rollNumbers) + 1;
    } else {
      // Fallback if roll numbers are purely strings (unlikely but possible)
      nextRollNumber = studentsInSection.length + 1;
    }
  }

  // 2. Generate Unique Student ID
  // Format: STU-[Year]-[ClassCode]-[Section]-[NextRoll]
  // Alternatively: STU-[Year]-[NextGlobalId]
  const currentYear = new Date().getFullYear();
  
  const lastStudent = await prisma.student.findFirst({
    where: {
      studentId: {
        startsWith: `STU-${currentYear}-`
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  let nextStudentSeq = 1;
  if (lastStudent) {
    const parts = lastStudent.studentId.split('-');
    if (parts.length >= 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextStudentSeq = lastSeq + 1;
      }
    }
  }

  const generatedStudentId = `STU-${currentYear}-${nextStudentSeq.toString().padStart(4, '0')}`;

  return res.status(200).json(
    new ApiResponse(200, { 
      studentId: generatedStudentId, 
      rollNumber: nextRollNumber.toString() 
    }, 'Credentials generated successfully')
  );
});

export const createStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    studentId, fullName, rollNumber, className, section, gender,
    email, dateOfBirth, bloodGroup, phone, parentName, parentPhone,
    address, admissionDate, profileImage
  } = req.body;

  if (!studentId || !fullName || !rollNumber || !className || !section || !gender) {
    throw new ApiError(400, 'Student ID, full name, roll number, class, section, and gender are required');
  }

  // Check if studentId already exists
  const existingId = await prisma.student.findUnique({
    where: { studentId }
  });
  if (existingId) {
    throw new ApiError(400, `Student ID '${studentId}' is already assigned to another student.`);
  }

  // Check if email already exists
  if (email) {
    const existingEmail = await prisma.student.findUnique({
      where: { email }
    });
    if (existingEmail) {
      throw new ApiError(400, `Email address '${email}' is already in use.`);
    }
  }

  // Check if phone already exists
  if (phone) {
    const existingPhone = await prisma.student.findFirst({
      where: { phone }
    });
    if (existingPhone) {
      throw new ApiError(400, `Phone number '${phone}' is already in use.`);
    }
  }

  // Check if Roll Number already exists in the same Class and Section
  const existingRoll = await prisma.student.findUnique({
    where: {
      className_section_rollNumber: {
        className,
        section,
        rollNumber
      }
    }
  });

  if (existingRoll) {
    throw new ApiError(400, `Roll Number '${rollNumber}' is already taken in ${className} Section ${section}.`);
  }

  try {
    const student = await prisma.student.create({
      data: {
        studentId,
        fullName,
        rollNumber,
        className,
        section,
        gender,
        email: email || null,
        dateOfBirth: (dateOfBirth && dateOfBirth !== '') ? new Date(dateOfBirth) : null,
        bloodGroup: bloodGroup || null,
        phone: phone || null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
        address: address || null,
        admissionDate: (admissionDate && admissionDate !== '') ? new Date(admissionDate) : undefined,
        profileImage: profileImage || null
      },
    });

    if (req.user) {
      await AuditService.logChange('CREATE', 'Student', student.id, req.user.id, null, student);
    }

    return res.status(201).json(
      new ApiResponse(201, student, 'Student created successfully')
    );
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw new ApiError(500, error.message || 'Failed to create student');
  }
});

export const updateStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  // Log the incoming body to see what the frontend is sending
  console.log(`[BACKEND DEBUG] Updating student ${id}. Body:`, req.body);

  const {
    fullName, rollNumber, className, section, gender,
    email, dateOfBirth, bloodGroup, phone, parentName, parentPhone,
    address, admissionDate, profileImage
  } = req.body;

  const oldStudent = await prisma.student.findUnique({
    where: { id: Number(id) }
  });

  if (!oldStudent) {
    throw new ApiError(404, 'Student not found');
  }

  try {
    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        fullName,
        rollNumber,
        className,
        section,
        gender,
        email: email || null,
        dateOfBirth: (dateOfBirth && dateOfBirth !== '') ? new Date(dateOfBirth) : null,
        bloodGroup: bloodGroup || null,
        phone: phone || null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
        address: address || null,
        admissionDate: (admissionDate && admissionDate !== '') ? new Date(admissionDate) : undefined,
        profileImage: profileImage || null
      },
    });

    if (req.user) {
      await AuditService.logChange('UPDATE', 'Student', id, req.user.id, oldStudent, student);
    }

    return res.status(200).json(
      new ApiResponse(200, student, 'Student updated successfully')
    );
  } catch (error: any) {
    console.error('Error updating student:', error);
    throw new ApiError(500, error.message || 'Failed to update student');
  }
});

export const deleteStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const oldStudent = await prisma.student.findUnique({
    where: { id: Number(id) }
  });

  if (!oldStudent) {
    throw new ApiError(404, 'Student not found');
  }

  await prisma.student.delete({
    where: { id: Number(id) },
  });

  if (req.user) {
    await AuditService.logChange('DELETE', 'Student', id, req.user.id, oldStudent, null);
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Student deleted successfully')
  );
});
