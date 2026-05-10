import { z } from 'zod';

// Auth Schemas
export const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const registerSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['ADMIN', 'TEACHER']).optional(),
  }),
};

// Student Schemas
export const studentSchema = {
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    rollNumber: z.string().min(1, 'Roll number is required'),
    className: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    parentName: z.string().optional().or(z.literal('')),
    parentPhone: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    bloodGroup: z.string().optional().or(z.literal('')),
    dateOfBirth: z.string().optional().or(z.literal('')),
    admissionDate: z.string().optional().or(z.literal('')),
    profileImage: z.string().url().optional().or(z.literal('')),
  }),
};

export const studentQuerySchema = {
  query: z.object({
    className: z.string().optional(),
  }),
};

export const idParamSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
};

// Marks Schemas
export const bulkMarksSchema = {
  body: z.object({
    records: z.array(z.object({
      studentId: z.number(),
      subject: z.string(),
      examType: z.string(),
      score: z.number().min(0),
      maxScore: z.number().min(1),
      date: z.string().optional(),
    })),
  }),
};

export const finalizeMarksSchema = {
  body: z.object({
    className: z.string(),
    subject: z.string(),
    examType: z.string(),
    date: z.string(),
  }),
};

export const lockStatusQuerySchema = {
  query: z.object({
    className: z.string(),
    subject: z.string(),
    examType: z.string(),
    date: z.string(),
  }),
};

// Attendance Schemas
export const bulkAttendanceSchema = {
  body: z.object({
    records: z.array(z.object({
      studentId: z.number(),
      date: z.string(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    })),
  }),
};

export const attendanceQuerySchema = {
  query: z.object({
    studentId: z.string().optional(),
    date: z.string().optional(),
    className: z.string().optional(),
  }),
};
