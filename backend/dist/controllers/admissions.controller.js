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
exports.admitInquiry = exports.deleteInquiry = exports.updateInquiry = exports.getInquiryById = exports.getInquiries = exports.createInquiry = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const client_1 = require("@prisma/client");
/**
 * Generate a unique Inquiry Number (e.g., INQ-2026-001)
 */
const generateInquiryNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear();
    // Find the last inquiry for this year
    const lastInquiry = yield prisma_1.default.inquiry.findFirst({
        where: {
            inquiryNumber: {
                startsWith: `INQ-${currentYear}-`
            }
        },
        orderBy: {
            id: 'desc'
        }
    });
    if (!lastInquiry) {
        return `INQ-${currentYear}-001`;
    }
    const lastSequence = parseInt(lastInquiry.inquiryNumber.split('-')[2], 10);
    const nextSequence = (lastSequence + 1).toString().padStart(3, '0');
    return `INQ-${currentYear}-${nextSequence}`;
});
/**
 * @desc    Create a new admission inquiry
 * @route   POST /api/admissions/inquiries
 * @access  Private (Admin, Principal, Staff)
 */
exports.createInquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, parentName, phone, email, interestedGrade, previousSchool, source, notes, nextFollowUp, assignedToId } = req.body;
    if (!studentName || !parentName || !phone || !interestedGrade) {
        throw new apiError_1.ApiError(400, 'Student Name, Parent Name, Phone, and Interested Grade are required fields');
    }
    const inquiryNumber = yield generateInquiryNumber();
    const inquiry = yield prisma_1.default.inquiry.create({
        data: {
            inquiryNumber,
            studentName,
            parentName,
            phone,
            email,
            interestedGrade,
            previousSchool,
            source: source || client_1.InquirySource.OTHER,
            status: client_1.InquiryStatus.NEW,
            notes,
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
            assignedToId: assignedToId ? parseInt(assignedToId, 10) : null
        },
        include: {
            assignedTo: {
                select: { id: true, name: true }
            }
        }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, inquiry, 'Inquiry created successfully'));
}));
/**
 * @desc    Get all inquiries with optional filtering
 * @route   GET /api/admissions/inquiries
 * @access  Private
 */
exports.getInquiries = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, source, assignedToId, search } = req.query;
    const where = {};
    if (status)
        where.status = status;
    if (source)
        where.source = source;
    if (assignedToId)
        where.assignedToId = parseInt(assignedToId, 10);
    if (search) {
        where.OR = [
            { studentName: { contains: search, mode: 'insensitive' } },
            { parentName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { inquiryNumber: { contains: search, mode: 'insensitive' } }
        ];
    }
    const inquiries = yield prisma_1.default.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            assignedTo: {
                select: { id: true, name: true }
            }
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, inquiries, 'Inquiries retrieved successfully'));
}));
/**
 * @desc    Get a single inquiry by ID
 * @route   GET /api/admissions/inquiries/:id
 * @access  Private
 */
exports.getInquiryById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const inquiry = yield prisma_1.default.inquiry.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
            assignedTo: {
                select: { id: true, name: true }
            }
        }
    });
    if (!inquiry) {
        throw new apiError_1.ApiError(404, 'Inquiry not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, inquiry, 'Inquiry retrieved successfully'));
}));
/**
 * @desc    Update an inquiry
 * @route   PUT /api/admissions/inquiries/:id
 * @access  Private
 */
exports.updateInquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, notes, nextFollowUp, assignedToId, studentName, parentName, phone, email, interestedGrade, previousSchool, source } = req.body;
    const existingInquiry = yield prisma_1.default.inquiry.findUnique({
        where: { id: parseInt(id, 10) }
    });
    if (!existingInquiry) {
        throw new apiError_1.ApiError(404, 'Inquiry not found');
    }
    const updatedInquiry = yield prisma_1.default.inquiry.update({
        where: { id: parseInt(id, 10) },
        data: {
            status: status,
            notes,
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
            assignedToId: assignedToId ? parseInt(assignedToId, 10) : null,
            studentName,
            parentName,
            phone,
            email,
            interestedGrade,
            previousSchool,
            source: source
        },
        include: {
            assignedTo: {
                select: { id: true, name: true }
            }
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, updatedInquiry, 'Inquiry updated successfully'));
}));
/**
 * @desc    Delete an inquiry
 * @route   DELETE /api/admissions/inquiries/:id
 * @access  Private (Admin only)
 */
exports.deleteInquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingInquiry = yield prisma_1.default.inquiry.findUnique({
        where: { id: parseInt(id, 10) }
    });
    if (!existingInquiry) {
        throw new apiError_1.ApiError(404, 'Inquiry not found');
    }
    yield prisma_1.default.inquiry.delete({
        where: { id: parseInt(id, 10) }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Inquiry deleted successfully'));
}));
/**
 * @desc    Convert an Inquiry into a Student (Admit)
 * @route   POST /api/admissions/inquiries/:id/admit
 * @access  Private (Admin, Principal)
 */
exports.admitInquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { studentId, rollNumber, className, section, gender, dateOfBirth, bloodGroup, address } = req.body;
    // Validation
    if (!studentId || !rollNumber || !className || !section || !gender) {
        throw new apiError_1.ApiError(400, 'Student ID, Roll Number, Class, Section, and Gender are required for admission');
    }
    const inquiry = yield prisma_1.default.inquiry.findUnique({
        where: { id: parseInt(id, 10) }
    });
    if (!inquiry) {
        throw new apiError_1.ApiError(404, 'Inquiry not found');
    }
    if (inquiry.status === client_1.InquiryStatus.ADMITTED) {
        throw new apiError_1.ApiError(400, 'This inquiry has already been converted to a student');
    }
    // Check if student ID exists
    const existingStudent = yield prisma_1.default.student.findUnique({
        where: { studentId }
    });
    if (existingStudent) {
        throw new apiError_1.ApiError(400, `A student with ID ${studentId} already exists`);
    }
    // Use a transaction to create the student and update the inquiry status
    const result = yield prisma_1.default.$transaction((prismaClient) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Create the Student
        const newStudent = yield prismaClient.student.create({
            data: {
                studentId,
                fullName: inquiry.studentName,
                rollNumber,
                className,
                section,
                gender,
                email: inquiry.email,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                bloodGroup,
                phone: inquiry.phone, // using inquiry phone for student if separate not provided
                parentName: inquiry.parentName,
                parentPhone: inquiry.phone,
                address,
                admissionDate: new Date()
            }
        });
        // 2. Update Inquiry Status
        yield prismaClient.inquiry.update({
            where: { id: inquiry.id },
            data: { status: client_1.InquiryStatus.ADMITTED }
        });
        return newStudent;
    }));
    res.status(201).json(new apiResponse_1.ApiResponse(201, result, 'Student admitted successfully from inquiry'));
}));
