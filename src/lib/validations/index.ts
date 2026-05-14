import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'], {
    message: 'Please select a valid role',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  className: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Please select a gender',
  }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional().or(z.literal('')),
  parentName: z.string().min(2, 'Parent name is required').optional().or(z.literal('')),
  parentPhone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  bloodGroup: z.string().optional().or(z.literal('')),
  admissionDate: z.string().optional().or(z.literal('')),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const marksSchema = z.object({
  score: z.coerce.number()
    .min(0, 'Score cannot be negative'),
  maxScore: z.coerce.number()
    .min(1, 'Max score must be greater than 0'),
}).refine(data => data.score <= data.maxScore, {
  message: "Score cannot exceed maximum marks",
  path: ["score"]
});

export type MarksFormData = z.infer<typeof marksSchema>;

export const schoolProfileSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  academicYear: z.string().min(4, 'Academic year is required'),
});

export type SchoolProfileFormData = z.infer<typeof schoolProfileSchema>;

export const questionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1, 'Question text is required'),
  questionType: z.enum(['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE']),
  marks: z.coerce.number().min(1, 'Marks must be positive'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  instructions: z.string().optional(),
  order: z.number().optional(),
});

export const questionPaperSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  className: z.string().min(1, 'Class is required'),
  section: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  examType: z.string().min(1, 'Exam type is required'),
  duration: z.coerce.number().min(10, 'Duration must be at least 10 minutes'),
  totalMarks: z.coerce.number().min(1, 'Total marks must be positive'),
  examDate: z.string().min(1, 'Exam date is required'),
  instructions: z.string().optional(),
  questions: z.array(questionSchema).optional(),
});

export type QuestionPaperForm = z.infer<typeof questionPaperSchema>;
