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

export const uuidParamSchema = {
  params: z.object({
    id: z.string().uuid('ID must be a valid UUID'),
  }),
};

// Question Paper Schemas
export const createQuestionPaperSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    className: z.string().min(1, 'Class is required'),
    section: z.string().optional(),
    subject: z.string().min(1, 'Subject is required'),
    examType: z.string().min(1, 'Exam type is required'),
    totalMarks: z.number().positive('Total marks must be positive'),
    duration: z.number().positive('Duration must be positive'),
    examDate: z.string().datetime({ message: "Invalid datetime string" }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').transform(val => new Date(val).toISOString())).optional(),
    instructions: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isTemplate: z.boolean().optional(),
    templateId: z.string().uuid().optional(),
    questions: z.array(z.object({
      questionType: z.string().min(1),
      questionText: z.string().min(1),
      marks: z.number().positive(),
      order: z.number().nonnegative(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string().optional(),
      instructions: z.string().optional(),
    })).optional(),
  }),
};

export const updateQuestionPaperSchema = {
  body: z.object({
    title: z.string().min(1).optional(),
    className: z.string().min(1).optional(),
    section: z.string().optional(),
    subject: z.string().min(1).optional(),
    examType: z.string().min(1).optional(),
    totalMarks: z.number().positive().optional(),
    duration: z.number().positive().optional(),
    examDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(val => new Date(val).toISOString())).optional(),
    instructions: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isTemplate: z.boolean().optional(),
    templateId: z.string().uuid().optional(),
    questions: z.array(z.object({
      questionType: z.string().min(1),
      questionText: z.string().min(1),
      marks: z.number().positive(),
      order: z.number().nonnegative(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string().optional(),
      instructions: z.string().optional(),
    })).optional(),
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
