import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';

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

export const createStudent = asyncHandler(async (req: Request, res: Response) => {
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
        profileImage: profileImage || null,
      },
    });

    return res.status(201).json(
      new ApiResponse(201, student, 'Student created successfully')
    );
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw new ApiError(500, error.message || 'Failed to create student');
  }
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    fullName, rollNumber, className, section, gender,
    email, dateOfBirth, bloodGroup, phone, parentName, parentPhone,
    address, admissionDate, profileImage
  } = req.body;

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
        profileImage: profileImage || null,
      },
    });

    return res.status(200).json(
      new ApiResponse(200, student, 'Student updated successfully')
    );
  } catch (error: any) {
    console.error('Error updating student:', error);
    throw new ApiError(500, error.message || 'Failed to update student');
  }
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.student.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Student deleted successfully')
  );
});
