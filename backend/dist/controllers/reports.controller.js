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
exports.getAttendanceSummary = exports.getClassPerformance = exports.updateTeacherRemarks = exports.getStudentReport = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const reportsService = __importStar(require("../services/reports.service"));
const prisma_1 = __importDefault(require("../prisma"));
exports.getStudentReport = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, examType } = req.query;
    if (!studentId || !examType) {
        throw new apiError_1.ApiError(400, 'Student ID and Exam Type are required');
    }
    const reportData = yield reportsService.getStudentReportData(Number(studentId), examType);
    if (!reportData) {
        throw new apiError_1.ApiError(404, 'Student or Report data not found');
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, reportData, 'Report card data fetched successfully'));
}));
exports.updateTeacherRemarks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, examType, remarks } = req.body;
    if (!studentId || !examType) {
        throw new apiError_1.ApiError(400, 'Student ID and Exam Type are required');
    }
    const updatedReport = yield reportsService.generateOrUpdateReport(Number(studentId), examType, remarks);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedReport, 'Teacher remarks updated successfully'));
}));
exports.getClassPerformance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, examType, section } = req.query;
    if (!className || !examType) {
        throw new apiError_1.ApiError(400, 'Class Name and Exam Type are required');
    }
    const performance = yield reportsService.getClassPerformance(className, examType, section);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, performance, 'Class performance report fetched successfully'));
}));
exports.getAttendanceSummary = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section, startDate, endDate } = req.query;
    const where = {};
    if (className)
        where.className = className;
    if (section)
        where.section = section;
    const students = yield prisma_1.default.student.findMany({
        where,
        select: {
            id: true,
            fullName: true,
            rollNumber: true,
            className: true,
            section: true
        }
    });
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const summary = yield Promise.all(students.map((s) => __awaiter(void 0, void 0, void 0, function* () {
        const rate = yield reportsService.getAttendanceStats(s.id, start, end);
        return Object.assign(Object.assign({}, s), { attendanceRate: rate });
    })));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, summary, 'Attendance summary fetched successfully'));
}));
