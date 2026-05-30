"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getParentResults = exports.getParentReportCard = exports.getParentDashboard = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const reportsService = __importStar(require("../services/reports.service"));
const reportCardHtmlGenerator_1 = require("../utils/reportCardHtmlGenerator");
const pdfGenerator_1 = require("../utils/pdfGenerator");
exports.getParentDashboard = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // 1. Find all students linked to this parent
    const students = yield prisma_1.default.student.findMany({
        where: { parentId: userId },
        select: {
            id: true,
            studentId: true,
            fullName: true,
            className: true,
            section: true,
            rollNumber: true,
            profileImage: true,
        }
    });
    // 2. Gather data for each student
    const dashboardData = yield Promise.all(students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
        // A. Today's Attendance
        const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');
        const todayAttendance = yield prisma_1.default.attendance.findUnique({
            where: {
                studentId_date: {
                    studentId: student.id,
                    date: today
                }
            },
            select: { status: true }
        });
        // B. Unpaid Fee Vouchers
        const unpaidVouchers = yield prisma_1.default.feeVoucher.findMany({
            where: {
                studentId: student.id,
                status: 'UNPAID'
            },
            select: {
                id: true,
                month: true,
                year: true,
                totalAmount: true,
                dueDate: true
            },
            orderBy: { dueDate: 'asc' }
        });
        // C. Recent Academic Reports (Term Results)
        const recentReports = yield prisma_1.default.termResult.findMany({
            where: { studentId: student.id },
            select: {
                examType: true,
                percentage: true,
                grade: true,
                status: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
        });
        return {
            student,
            attendanceToday: (todayAttendance === null || todayAttendance === void 0 ? void 0 : todayAttendance.status) || 'NOT_MARKED',
            unpaidVouchers,
            totalDue: unpaidVouchers.reduce((sum, v) => sum + v.totalAmount, 0),
            latestResult: recentReports.length > 0 ? recentReports[0] : null
        };
    })));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, dashboardData, 'Parent dashboard data fetched successfully'));
}));
exports.getParentReportCard = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { studentId, examType } = req.params;
    const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!studentId || !examType) {
        throw new apiError_1.ApiError(400, 'Student ID and Exam Type are required');
    }
    // Verify parent-student relationship
    const student = yield prisma_1.default.student.findUnique({
        where: { id: Number(studentId) },
        select: { parentId: true, fullName: true }
    });
    if (!student || student.parentId !== parentId) {
        throw new apiError_1.ApiError(403, 'You are not authorized to access this report');
    }
    const reportData = yield reportsService.getStudentReportData(Number(studentId), examType);
    if (!reportData) {
        throw new apiError_1.ApiError(404, 'Student or Report data not found');
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findUnique({ where: { id: 1 } });
    const html = (0, reportCardHtmlGenerator_1.generateReportCardHtml)(reportData, schoolProfile);
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ReportCard_${student.fullName.replace(/\s+/g, '_')}_${examType}.pdf`);
    return res.send(pdfBuffer);
}));
exports.getParentResults = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { studentId } = req.params;
    const { examType } = req.query;
    const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!studentId) {
        throw new apiError_1.ApiError(400, 'Student ID is required');
    }
    // Verify parent-student relationship
    const student = yield prisma_1.default.student.findUnique({
        where: { id: Number(studentId) },
        select: { parentId: true }
    });
    if (!student || student.parentId !== parentId) {
        throw new apiError_1.ApiError(403, 'You are not authorized to access this data');
    }
    // If examType is provided, get detailed subject-wise marks
    if (examType) {
        const reportData = yield reportsService.getStudentReportData(Number(studentId), examType);
        if (!reportData) {
            throw new apiError_1.ApiError(404, 'No report data found for this exam type');
        }
        return res.status(200).json(new apiResponse_1.ApiResponse(200, reportData, 'Subject-wise results fetched successfully'));
    }
    // Otherwise, get historical TermResult aggregates
    const results = yield prisma_1.default.termResult.findMany({
        where: { studentId: Number(studentId) },
        orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, results, 'Aggregate results fetched successfully'));
}));
