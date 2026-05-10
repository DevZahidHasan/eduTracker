"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceQuerySchema = exports.bulkAttendanceSchema = exports.lockStatusQuerySchema = exports.finalizeMarksSchema = exports.bulkMarksSchema = exports.idParamSchema = exports.studentQuerySchema = exports.studentSchema = exports.registerSchema = exports.loginSchema = void 0;
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
        role: zod_1.z.enum(['ADMIN', 'TEACHER']).optional(),
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
        profileImage: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
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
