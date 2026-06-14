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
exports.unlockAttendance = exports.getAttendanceLockStatus = exports.getAttendanceById = exports.bulkCreateAttendance = exports.getAttendance = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const email_service_1 = require("../services/email.service");
const whatsapp_service_1 = require("../services/whatsapp.service");
const audit_service_1 = require("../services/audit.service");
const notifications_controller_1 = require("./notifications.controller");
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
    var _a, _b;
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
        throw new apiError_1.ApiError(400, 'Attendance records array is required and cannot be empty');
    }
    // Get the first student to find class and section
    const firstStudentId = Number(records[0].studentId);
    const studentInfo = yield prisma_1.default.student.findUnique({
        where: { id: firstStudentId },
        select: { className: true, section: true }
    });
    if (!studentInfo) {
        throw new apiError_1.ApiError(404, 'Student not found');
    }
    const attendanceDate = new Date(records[0].date);
    // Reset time to midnight for consistency
    attendanceDate.setHours(0, 0, 0, 0);
    // Check if attendance is locked for this class/section/date
    const existingLock = yield prisma_1.default.attendanceLock.findUnique({
        where: {
            className_section_date: {
                className: studentInfo.className,
                section: studentInfo.section,
                date: attendanceDate
            }
        }
    });
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (existingLock && userRole !== 'ADMIN' && userRole !== 'PRINCIPAL') {
        throw new apiError_1.ApiError(403, 'Attendance for this section is locked and can only be updated by Admin or Principal');
    }
    // Check if all students in this section are included
    const sectionStudents = yield prisma_1.default.student.findMany({
        where: {
            className: studentInfo.className,
            section: studentInfo.section
        },
        select: { id: true }
    });
    // Verify that every student in the section is in the records
    const recordStudentIds = new Set(records.map(r => Number(r.studentId)));
    const missingStudents = sectionStudents.filter(s => !recordStudentIds.has(s.id));
    if (missingStudents.length > 0) {
        throw new apiError_1.ApiError(400, `All students in the section must be marked. Missing ${missingStudents.length} student(s).`);
    }
    // Use a transaction to ensure all or nothing
    const results = yield prisma_1.default.$transaction(records.map((record) => {
        const { studentId, status } = record;
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
    // Lock the attendance for this section/date if not already locked
    if (!existingLock && req.user) {
        yield prisma_1.default.attendanceLock.create({
            data: {
                className: studentInfo.className,
                section: studentInfo.section,
                date: attendanceDate,
                lockedBy: req.user.id
            }
        });
    }
    if (req.user) {
        yield audit_service_1.AuditService.logChange('UPDATE', 'Attendance', 'BULK', req.user.id, null, { count: results.length, records });
    }
    // Trigger parent notifications in background
    results.forEach(record => {
        (0, email_service_1.sendParentAttendanceNotification)(record.id).catch(err => console.error(`Failed to send email for attendance ${record.id}:`, err));
        (0, whatsapp_service_1.sendParentAttendanceWhatsApp)(record.id).catch(err => console.error(`Failed to send WhatsApp for attendance ${record.id}:`, err));
    });
    // Notify Admins about bulk update
    const admins = yield prisma_1.default.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
        yield (0, notifications_controller_1.createNotification)({
            userId: admin.id,
            title: 'Bulk Attendance Update',
            message: `${results.length} attendance records were processed by ${((_b = req.user) === null || _b === void 0 ? void 0 : _b.name) || 'a staff member'}.`,
            type: 'INFO',
            link: '/attendance'
        });
    }
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
exports.getAttendanceLockStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section, date } = req.query;
    if (!className || !section || !date) {
        throw new apiError_1.ApiError(400, 'className, section, and date are required');
    }
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const lock = yield prisma_1.default.attendanceLock.findUnique({
        where: {
            className_section_date: {
                className: className,
                section: section,
                date: attendanceDate
            }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { isLocked: !!lock, lockData: lock }, 'Lock status fetched successfully'));
}));
exports.unlockAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { className, section, date } = req.body;
    if (!className || !section || !date) {
        throw new apiError_1.ApiError(400, 'className, section, and date are required');
    }
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (userRole !== 'ADMIN' && userRole !== 'PRINCIPAL') {
        throw new apiError_1.ApiError(403, 'Only Admins and Principals can unlock attendance');
    }
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const lock = yield prisma_1.default.attendanceLock.findUnique({
        where: {
            className_section_date: {
                className: className,
                section: section,
                date: attendanceDate
            }
        }
    });
    if (!lock) {
        throw new apiError_1.ApiError(404, 'Attendance is not locked for this section on this date');
    }
    yield prisma_1.default.attendanceLock.delete({
        where: {
            id: lock.id
        }
    });
    if (req.user) {
        yield audit_service_1.AuditService.logChange('DELETE', 'AttendanceLock', lock.id.toString(), req.user.id, lock, null);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Attendance unlocked successfully'));
}));
