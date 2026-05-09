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
exports.deleteAttendance = exports.updateAttendance = exports.createAttendance = exports.getAttendanceById = exports.bulkCreateAttendance = exports.getAttendance = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
exports.getAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, date, className } = req.query;
    const whereClause = {};
    if (studentId)
        whereClause.studentId = Number(studentId);
    if (date)
        whereClause.date = { equals: new Date(date) };
    if (className) {
        whereClause.student = {
            className: className
        };
    }
    const attendances = yield prisma_1.default.attendance.findMany({
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
    return res.status(200).json(new apiResponse_1.ApiResponse(200, attendances, 'Attendance records fetched successfully'));
}));
exports.bulkCreateAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { records } = req.body; // Array of { studentId, date, status }
    if (!records || !Array.isArray(records)) {
        throw new apiError_1.ApiError(400, 'Attendance records array is required');
    }
    // Use a transaction to ensure all or nothing
    const results = yield prisma_1.default.$transaction(records.map((record) => {
        const { studentId, date, status } = record;
        const attendanceDate = new Date(date);
        // Reset time to midnight for consistency
        attendanceDate.setHours(0, 0, 0, 0);
        return prisma_1.default.attendance.upsert({
            where: {
                studentId_date: {
                    studentId: Number(studentId),
                    date: attendanceDate,
                },
            },
            update: {
                status,
            },
            create: {
                studentId: Number(studentId),
                date: attendanceDate,
                status,
            },
        });
    }));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, results, 'Bulk attendance processed successfully'));
}));
exports.getAttendanceById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const attendance = yield prisma_1.default.attendance.findUnique({ where: { id: Number(id) } });
    if (!attendance) {
        throw new apiError_1.ApiError(404, 'Attendance record not found');
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, attendance, 'Attendance record fetched successfully'));
}));
exports.createAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, date, status } = req.body;
    if (!studentId || !status) {
        throw new apiError_1.ApiError(400, 'Student ID and status are required');
    }
    const attendance = yield prisma_1.default.attendance.create({
        data: {
            studentId,
            date: date ? new Date(date) : undefined,
            status,
        },
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, attendance, 'Attendance record created successfully'));
}));
exports.updateAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, date } = req.body;
    const attendance = yield prisma_1.default.attendance.update({
        where: { id: Number(id) },
        data: {
            status,
            date: date ? new Date(date) : undefined,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, attendance, 'Attendance record updated successfully'));
}));
exports.deleteAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.attendance.delete({
        where: { id: Number(id) },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Attendance record deleted successfully'));
}));
