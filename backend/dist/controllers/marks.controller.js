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
exports.deleteMark = exports.updateMark = exports.createMark = exports.getMarkById = exports.bulkCreateMarks = exports.getMarks = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
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
    const { records } = req.body; // Array of { studentId, subject, examType, score, maxScore, date }
    if (!records || !Array.isArray(records)) {
        throw new apiError_1.ApiError(400, 'Marks records array is required');
    }
    const results = yield prisma_1.default.$transaction(records.map((record) => {
        const { studentId, subject, examType, score, maxScore, date } = record;
        return prisma_1.default.mark.upsert({
            where: {
                studentId_subject_examType: {
                    studentId: Number(studentId),
                    subject,
                    examType,
                },
            },
            update: {
                score: Number(score),
                maxScore: Number(maxScore) || 100,
                date: date ? new Date(date) : undefined,
            },
            create: {
                studentId: Number(studentId),
                subject,
                examType,
                score: Number(score),
                maxScore: Number(maxScore) || 100,
                date: date ? new Date(date) : undefined,
            },
        });
    }));
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
    const mark = yield prisma_1.default.mark.create({
        data: {
            studentId: Number(studentId),
            subject,
            examType,
            score: Number(score),
            maxScore: Number(maxScore) || 100,
            date: date ? new Date(date) : undefined,
        },
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, mark, 'Mark created successfully'));
}));
exports.updateMark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { subject, examType, score, maxScore, date } = req.body;
    const mark = yield prisma_1.default.mark.update({
        where: { id: Number(id) },
        data: {
            subject,
            examType,
            score: score !== undefined ? Number(score) : undefined,
            maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
            date: date ? new Date(date) : undefined,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, mark, 'Mark updated successfully'));
}));
exports.deleteMark = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.mark.delete({
        where: { id: Number(id) },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Mark deleted successfully'));
}));
