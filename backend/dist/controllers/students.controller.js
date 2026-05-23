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
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.generateStudentCredentials = exports.uploadStudentPhoto = exports.getStudentById = exports.getAllStudents = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const audit_service_1 = require("../services/audit.service");
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
exports.uploadStudentPhoto = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new apiError_1.ApiError(400, 'No file uploaded');
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { imageUrl }, 'Student photo uploaded successfully'));
}));
const toBool = (val) => {
    if (val === true || val === 'true' || val === 1 || val === '1')
        return true;
    if (val === false || val === 'false' || val === 0 || val === '0')
        return false;
    return undefined;
};
exports.generateStudentCredentials = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section } = req.query;
    if (!className || !section) {
        throw new apiError_1.ApiError(400, 'Class and Section are required to generate credentials');
    }
    // 1. Generate Next Roll Number for the specific Class and Section
    const studentsInSection = yield prisma_1.default.student.findMany({
        where: {
            className: className,
            section: section,
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
        }
        else {
            // Fallback if roll numbers are purely strings (unlikely but possible)
            nextRollNumber = studentsInSection.length + 1;
        }
    }
    // 2. Generate Unique Student ID
    // Format: STU-[Year]-[ClassCode]-[Section]-[NextRoll]
    // Alternatively: STU-[Year]-[NextGlobalId]
    const currentYear = new Date().getFullYear();
    const lastStudent = yield prisma_1.default.student.findFirst({
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
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        studentId: generatedStudentId,
        rollNumber: nextRollNumber.toString()
    }, 'Credentials generated successfully'));
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
                profileImage: profileImage || null
            },
        });
        if (req.user) {
            yield audit_service_1.AuditService.logChange('CREATE', 'Student', student.id, req.user.id, null, student);
        }
        return res.status(201).json(new apiResponse_1.ApiResponse(201, student, 'Student created successfully'));
    }
    catch (error) {
        console.error('Error creating student:', error);
        throw new apiError_1.ApiError(500, error.message || 'Failed to create student');
    }
}));
exports.updateStudent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Log the incoming body to see what the frontend is sending
    console.log(`[BACKEND DEBUG] Updating student ${id}. Body:`, req.body);
    const { fullName, rollNumber, className, section, gender, email, dateOfBirth, bloodGroup, phone, parentName, parentPhone, address, admissionDate, profileImage } = req.body;
    const oldStudent = yield prisma_1.default.student.findUnique({
        where: { id: Number(id) }
    });
    if (!oldStudent) {
        throw new apiError_1.ApiError(404, 'Student not found');
    }
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
                profileImage: profileImage || null
            },
        });
        if (req.user) {
            yield audit_service_1.AuditService.logChange('UPDATE', 'Student', id, req.user.id, oldStudent, student);
        }
        return res.status(200).json(new apiResponse_1.ApiResponse(200, student, 'Student updated successfully'));
    }
    catch (error) {
        console.error('Error updating student:', error);
        throw new apiError_1.ApiError(500, error.message || 'Failed to update student');
    }
}));
exports.deleteStudent = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const oldStudent = yield prisma_1.default.student.findUnique({
        where: { id: Number(id) }
    });
    if (!oldStudent) {
        throw new apiError_1.ApiError(404, 'Student not found');
    }
    yield prisma_1.default.student.delete({
        where: { id: Number(id) },
    });
    if (req.user) {
        yield audit_service_1.AuditService.logChange('DELETE', 'Student', id, req.user.id, oldStudent, null);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Student deleted successfully'));
}));
