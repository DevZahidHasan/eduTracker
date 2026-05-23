"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceQuerySchema = exports.bulkAttendanceSchema = exports.lockStatusQuerySchema = exports.finalizeMarksSchema = exports.bulkMarksSchema = exports.updateQuestionPaperSchema = exports.createQuestionPaperSchema = exports.uuidParamSchema = exports.idParamSchema = exports.studentQuerySchema = exports.studentSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.loginSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
};
exports.registerSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        role: zod_1.z.string().min(1, 'Role is required').optional(),
    }),
};
// Student Schemas
exports.studentSchema = {
    body: zod_1.z.object({
        studentId: zod_1.z.string().min(1, 'Student ID is required'),
        fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters'),
        rollNumber: zod_1.z.string().min(1, 'Roll number is required'),
        className: zod_1.z.string().min(1, 'Class is required'),
        section: zod_1.z.string().min(1, 'Section is required'),
        gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        phone: zod_1.z.string().optional().or(zod_1.z.literal('')),
        parentName: zod_1.z.string().optional().or(zod_1.z.literal('')),
        parentPhone: zod_1.z.string().optional().or(zod_1.z.literal('')),
        address: zod_1.z.string().optional().or(zod_1.z.literal('')),
        bloodGroup: zod_1.z.string().optional().or(zod_1.z.literal('')),
        dateOfBirth: zod_1.z.string().optional().or(zod_1.z.literal('')),
        admissionDate: zod_1.z.string().optional().or(zod_1.z.literal('')),
        profileImage: zod_1.z.string().optional().or(zod_1.z.literal('')),
    }),
};
exports.studentQuerySchema = {
    query: zod_1.z.object({
        className: zod_1.z.string().optional(),
    }),
};
exports.idParamSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'ID must be a number'),
    }),
};
exports.uuidParamSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('ID must be a valid UUID'),
    }),
};
// Question Paper Schemas
exports.createQuestionPaperSchema = {
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        className: zod_1.z.string().min(1, 'Class is required'),
        section: zod_1.z.string().optional(),
        subject: zod_1.z.string().min(1, 'Subject is required'),
        examType: zod_1.z.string().min(1, 'Exam type is required'),
        totalMarks: zod_1.z.number().positive('Total marks must be positive'),
        duration: zod_1.z.number().positive('Duration must be positive'),
        examDate: zod_1.z.string().datetime({ message: "Invalid datetime string" }).or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').transform(val => new Date(val).toISOString())).optional(),
        instructions: zod_1.z.string().optional(),
        status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        isTemplate: zod_1.z.boolean().optional(),
        templateId: zod_1.z.string().uuid().optional(),
        questions: zod_1.z.array(zod_1.z.object({
            questionType: zod_1.z.string().min(1),
            questionText: zod_1.z.string().min(1),
            marks: zod_1.z.number().positive(),
            order: zod_1.z.number().nonnegative(),
            options: zod_1.z.array(zod_1.z.string()).optional(),
            correctAnswer: zod_1.z.string().optional(),
            instructions: zod_1.z.string().optional(),
        })).optional(),
    }),
};
exports.updateQuestionPaperSchema = {
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        className: zod_1.z.string().min(1).optional(),
        section: zod_1.z.string().optional(),
        subject: zod_1.z.string().min(1).optional(),
        examType: zod_1.z.string().min(1).optional(),
        totalMarks: zod_1.z.number().positive().optional(),
        duration: zod_1.z.number().positive().optional(),
        examDate: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(val => new Date(val).toISOString())).optional(),
        instructions: zod_1.z.string().optional(),
        status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        isTemplate: zod_1.z.boolean().optional(),
        templateId: zod_1.z.string().uuid().optional(),
        questions: zod_1.z.array(zod_1.z.object({
            questionType: zod_1.z.string().min(1),
            questionText: zod_1.z.string().min(1),
            marks: zod_1.z.number().positive(),
            order: zod_1.z.number().nonnegative(),
            options: zod_1.z.array(zod_1.z.string()).optional(),
            correctAnswer: zod_1.z.string().optional(),
            instructions: zod_1.z.string().optional(),
        })).optional(),
    }),
};
// Marks Schemas
exports.bulkMarksSchema = {
    body: zod_1.z.object({
        records: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.number(),
            subject: zod_1.z.string(),
            examType: zod_1.z.string(),
            score: zod_1.z.number().min(0),
            maxScore: zod_1.z.number().min(1),
            date: zod_1.z.string().optional(),
        })),
    }),
};
exports.finalizeMarksSchema = {
    body: zod_1.z.object({
        className: zod_1.z.string(),
        subject: zod_1.z.string(),
        examType: zod_1.z.string(),
        date: zod_1.z.string(),
    }),
};
exports.lockStatusQuerySchema = {
    query: zod_1.z.object({
        className: zod_1.z.string(),
        subject: zod_1.z.string(),
        examType: zod_1.z.string(),
        date: zod_1.z.string(),
    }),
};
// Attendance Schemas
exports.bulkAttendanceSchema = {
    body: zod_1.z.object({
        records: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.number(),
            date: zod_1.z.string(),
            status: zod_1.z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
        })),
    }),
};
exports.attendanceQuerySchema = {
    query: zod_1.z.object({
        studentId: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(),
        className: zod_1.z.string().optional(),
    }),
};
