"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getAllStudents = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
exports.getAllStudents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className } = req.query;
    const where = {};
    if (className) {
        where.className = className;
    }
    const students = yield prisma_1.default.student.findMany({
        where,
        orderBy: {
            rollNumber: 'asc'
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, students, 'Students fetched successfully'));
}));
exports.getStudentById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const student = yield prisma_1.default.student.findUnique({
        where: { id: Number(id) },
        include: { marks: true, attendances: true },
    });
    if (!student) {
        throw new apiError_1.ApiError(404, 'Student not found');
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, student, 'Student fetched successfully'));
}));
exports.createStudent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, fullName, rollNumber, className, section, gender, email, dateOfBirth, bloodGroup, phone, parentName, parentPhone, address, admissionDate, profileImage } = req.body;
    if (!studentId || !fullName || !rollNumber || !className || !section || !gender) {
        throw new apiError_1.ApiError(400, 'Student ID, full name, roll number, class, section, and gender are required');
    }
    // Check if studentId already exists
    const existingId = yield prisma_1.default.student.findUnique({
        where: { studentId }
    });
    if (existingId) {
        throw new apiError_1.ApiError(400, `Student ID '${studentId}' is already assigned to another student.`);
    }
    // Check if email already exists
    if (email) {
        const existingEmail = yield prisma_1.default.student.findUnique({
            where: { email }
        });
        if (existingEmail) {
            throw new apiError_1.ApiError(400, `Email address '${email}' is already in use.`);
        }
    }
    // Check if phone already exists
    if (phone) {
        const existingPhone = yield prisma_1.default.student.findFirst({
            where: { phone }
        });
        if (existingPhone) {
            throw new apiError_1.ApiError(400, `Phone number '${phone}' is already in use.`);
        }
    }
    // Check if Roll Number already exists in the same Class and Section
    const existingRoll = yield prisma_1.default.student.findUnique({
        where: {
            className_section_rollNumber: {
                className,
                section,
                rollNumber
            }
        }
    });
    if (existingRoll) {
        throw new apiError_1.ApiError(400, `Roll Number '${rollNumber}' is already taken in ${className} Section ${section}.`);
    }
    try {
        const student = yield prisma_1.default.student.create({
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
        return res.status(201).json(new apiResponse_1.ApiResponse(201, student, 'Student created successfully'));
    }
    catch (error) {
        console.error('Error creating student:', error);
        throw new apiError_1.ApiError(500, error.message || 'Failed to create student');
    }
}));
exports.updateStudent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullName, rollNumber, className, section, gender, email, dateOfBirth, bloodGroup, phone, parentName, parentPhone, address, admissionDate, profileImage } = req.body;
    try {
        const student = yield prisma_1.default.student.update({
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
        return res.status(200).json(new apiResponse_1.ApiResponse(200, student, 'Student updated successfully'));
    }
    catch (error) {
        console.error('Error updating student:', error);
        throw new apiError_1.ApiError(500, error.message || 'Failed to update student');
    }
}));
exports.deleteStudent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.student.delete({
        where: { id: Number(id) },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Student deleted successfully'));
}));
