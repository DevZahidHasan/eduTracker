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
exports.checkMarkLock = exports.unlockMarks = exports.finalizeMarks = exports.deleteMark = exports.updateMark = exports.createMark = exports.getMarkById = exports.bulkCreateMarks = exports.getMarks = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const email_service_1 = require("../services/email.service");
const audit_service_1 = require("../services/audit.service");
const notifications_controller_1 = require("./notifications.controller");
exports.getMarks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, subject, examType, className } = req.query;
    const whereClause = {};
    if (studentId)
        whereClause.studentId = Number(studentId);
    if (subject)
        whereClause.subject = subject;
    if (examType)
        whereClause.examType = examType;
    if (className) {
        whereClause.student = {
            className: className
        };
    }
    const marks = yield prisma_1.default.mark.findMany({
        where: whereClause,
        include: {
            student: {
                select: {
                    fullName: true,
                    rollNumber: true,
                    studentId: true
                }
            }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, marks, 'Marks fetched successfully'));
}));
exports.bulkCreateMarks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
        throw new apiError_1.ApiError(400, 'Marks records array is required');
    }
    const results = yield prisma_1.default.$transaction(records.map((record) => {
        const { studentId, subject, examType, score, maxScore, date } = record;
        const markDate = new Date(date || new Date());
        markDate.setHours(0, 0, 0, 0);
        return prisma_1.default.mark.upsert({
            where: {
                studentId_subject_examType_date: {
                    studentId: Number(studentId),
                    subject,
                    examType,
                    date: markDate,
                },
            },
            update: {
                score: Number(score),
                maxScore: Number(maxScore) || 100,
            },
            create: {
                studentId: Number(studentId),
                subject,
                examType,
                score: Number(score),
                maxScore: Number(maxScore) || 100,
                date: markDate,
            },
        });
    }));
    if (req.user) {
        yield audit_service_1.AuditService.logChange('UPDATE', 'Mark', 'BULK', req.user.id, null, { count: results.length, records });
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, results, 'Bulk marks processed successfully'));
}));
exports.getMarkById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const mark = yield prisma_1.default.mark.findUnique({ where: { id: Number(id) } });
    if (!mark) {
        throw new apiError_1.ApiError(404, 'Mark not found');
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, mark, 'Mark fetched successfully'));
}));
exports.createMark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, subject, examType, score, maxScore, date } = req.body;
    if (!studentId || !subject || !examType || score === undefined) {
        throw new apiError_1.ApiError(400, 'Student ID, subject, exam type and score are required');
    }
    const markDate = new Date(date || new Date());
    markDate.setHours(0, 0, 0, 0);
    const mark = yield prisma_1.default.mark.create({
        data: {
            studentId: Number(studentId),
            subject,
            examType,
            score: Number(score),
            maxScore: Number(maxScore) || 100,
            date: markDate,
        },
    });
    if (req.user) {
        yield audit_service_1.AuditService.logChange('CREATE', 'Mark', mark.id, req.user.id, null, mark);
    }
    return res.status(201).json(new apiResponse_1.ApiResponse(201, mark, 'Mark created successfully'));
}));
exports.updateMark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { subject, examType, score, maxScore, date } = req.body;
    const oldMark = yield prisma_1.default.mark.findUnique({
        where: { id: Number(id) }
    });
    if (!oldMark) {
        throw new apiError_1.ApiError(404, 'Mark not found');
    }
    const markDate = date ? new Date(date) : undefined;
    if (markDate)
        markDate.setHours(0, 0, 0, 0);
    const mark = yield prisma_1.default.mark.update({
        where: { id: Number(id) },
        data: {
            subject,
            examType,
            score: score !== undefined ? Number(score) : undefined,
            maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
            date: markDate,
        },
    });
    if (req.user) {
        yield audit_service_1.AuditService.logChange('UPDATE', 'Mark', id, req.user.id, oldMark, mark);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, mark, 'Mark updated successfully'));
}));
exports.deleteMark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const oldMark = yield prisma_1.default.mark.findUnique({
        where: { id: Number(id) }
    });
    if (!oldMark) {
        throw new apiError_1.ApiError(404, 'Mark not found');
    }
    yield prisma_1.default.mark.delete({
        where: { id: Number(id) },
    });
    if (req.user) {
        yield audit_service_1.AuditService.logChange('DELETE', 'Mark', id, req.user.id, oldMark, null);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Mark deleted successfully'));
}));
exports.finalizeMarks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, subject, examType, date } = req.body;
    const user = req.user;
    if (!user) {
        throw new apiError_1.ApiError(401, 'Unauthorized');
    }
    if (!className || !subject || !examType || !date) {
        throw new apiError_1.ApiError(400, 'Class, Subject, Exam Type and Date are required');
    }
    const lockDate = new Date(date);
    lockDate.setHours(0, 0, 0, 0);
    const markLock = yield prisma_1.default.markLock.upsert({
        where: {
            className_subject_examType_date: { className, subject, examType, date: lockDate }
        },
        update: {
            lockedAt: new Date(),
            lockedBy: user.id
        },
        create: {
            className,
            subject,
            examType,
            date: lockDate,
            lockedBy: user.id
        }
    });
    yield audit_service_1.AuditService.logChange('UPDATE', 'MarkLock', `${className}-${subject}-${examType}`, user.id, null, markLock);
    // Notify Admins
    const admins = yield prisma_1.default.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
        yield (0, notifications_controller_1.createNotification)({
            userId: admin.id,
            title: 'Marks Finalized',
            message: `Exam marks for ${subject} (${examType}) in Class ${className} have been locked by ${user.name || user.email}.`,
            type: 'SUCCESS',
            link: '/marks'
        });
    }
    // Trigger email notification
    (0, email_service_1.sendMarkFinalizationAlert)(className, subject, examType, user.name || user.email);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, markLock, 'Marks finalized and locked successfully'));
}));
exports.unlockMarks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, subject, examType, date } = req.body;
    const user = req.user;
    if (!user) {
        throw new apiError_1.ApiError(401, 'Unauthorized');
    }
    if (user.role !== 'ADMIN') {
        throw new apiError_1.ApiError(403, 'Only administrators can unlock marks');
    }
    if (!className || !subject || !examType || !date) {
        throw new apiError_1.ApiError(400, 'Class, Subject, Exam Type and Date are required');
    }
    const lockDate = new Date(date);
    lockDate.setHours(0, 0, 0, 0);
    const oldLock = yield prisma_1.default.markLock.findUnique({
        where: {
            className_subject_examType_date: { className, subject, examType, date: lockDate }
        }
    });
    yield prisma_1.default.markLock.delete({
        where: {
            className_subject_examType_date: { className, subject, examType, date: lockDate }
        }
    });
    yield audit_service_1.AuditService.logChange('DELETE', 'MarkLock', `${className}-${subject}-${examType}`, user.id, oldLock, null);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Marks unlocked successfully'));
}));
exports.checkMarkLock = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, subject, examType, date } = req.query;
    if (!className || !subject || !examType || !date) {
        throw new apiError_1.ApiError(400, 'Class, Subject, Exam Type and Date are required');
    }
    const lockDate = new Date(date);
    lockDate.setHours(0, 0, 0, 0);
    const markLock = yield prisma_1.default.markLock.findUnique({
        where: {
            className_subject_examType_date: {
                className: className,
                subject: subject,
                examType: examType,
                date: lockDate
            }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { isLocked: !!markLock, lockDetails: markLock }, 'Lock status fetched'));
}));
