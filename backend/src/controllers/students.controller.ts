import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = await prisma.student.findMany();
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
  const { studentId, firstName, lastName, email, dateOfBirth } = req.body;

  if (!studentId || !firstName || !lastName) {
    throw new ApiError(400, 'Student ID, first name and last name are required');
  }

  const student = await prisma.student.create({
    data: {
      studentId,
      firstName,
      lastName,
      email,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, student, 'Student created successfully')
  );
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, dateOfBirth } = req.body;

  const student = await prisma.student.update({
    where: { id: Number(id) },
    data: {
      firstName,
      lastName,
      email,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, student, 'Student updated successfully')
  );
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
