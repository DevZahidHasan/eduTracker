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
exports.downloadSalarySlip = exports.paySalary = exports.getPayrollRecords = exports.generatePayroll = exports.updateLeaveStatus = exports.getLeaveRequests = exports.applyForLeave = exports.getStaffAttendance = exports.markStaffAttendance = exports.updateStaffSalary = exports.getStaffMembers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const client_1 = require("@prisma/client");
const pdfGenerator_1 = require("../utils/pdfGenerator");
const salarySlipHtmlGenerator_1 = require("../utils/salarySlipHtmlGenerator");
// ---------------------------------------------------------
// STAFF MANAGEMENT
// ---------------------------------------------------------
exports.getStaffMembers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const staff = yield prisma_1.default.user.findMany({
        where: {
            role: {
                in: ['TEACHER', 'STAFF', 'LIBRARIAN', 'ACCOUNTANT', 'CLERK', 'SECURITY', 'CLEANER']
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            profileImage: true,
            salary: true
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, staff, 'Staff members retrieved successfully'));
}));
exports.updateStaffSalary = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { baseSalary, allowances, deductions } = req.body;
    if (baseSalary === undefined) {
        throw new apiError_1.ApiError(400, 'Base salary is required');
    }
    const salary = yield prisma_1.default.staffSalary.upsert({
        where: { userId: parseInt(userId, 10) },
        update: {
            baseSalary: Number(baseSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0)
        },
        create: {
            userId: parseInt(userId, 10),
            baseSalary: Number(baseSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0)
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, salary, 'Staff salary updated successfully'));
}));
// ---------------------------------------------------------
// ATTENDANCE
// ---------------------------------------------------------
exports.markStaffAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, records } = req.body;
    // records: { userId: number, status: AttendanceStatus, remarks?: string }[]
    if (!date || !records || !Array.isArray(records)) {
        throw new apiError_1.ApiError(400, 'Invalid data. Date and records array are required.');
    }
    const attendanceDate = new Date(date);
    const results = yield prisma_1.default.$transaction(records.map((record) => prisma_1.default.staffAttendance.upsert({
        where: {
            userId_date: {
                userId: record.userId,
                date: attendanceDate
            }
        },
        update: {
            status: record.status,
            remarks: record.remarks
        },
        create: {
            userId: record.userId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks
        }
    })));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, results, 'Staff attendance marked successfully'));
}));
exports.getStaffAttendance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, month, year } = req.query;
    let where = {};
    if (date) {
        const searchDate = new Date(date);
        searchDate.setUTCHours(0, 0, 0, 0);
        const nextDate = new Date(searchDate);
        nextDate.setUTCDate(searchDate.getUTCDate() + 1);
        where.date = {
            gte: searchDate,
            lt: nextDate
        };
    }
    else if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        where.date = {
            gte: startDate,
            lte: endDate
        };
    }
    const attendance = yield prisma_1.default.staffAttendance.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, role: true }
            }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, attendance, 'Attendance retrieved successfully'));
}));
// ---------------------------------------------------------
// LEAVE REQUESTS
// ---------------------------------------------------------
exports.applyForLeave = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user.id;
    if (!startDate || !endDate || !reason) {
        throw new apiError_1.ApiError(400, 'Start date, end date, and reason are required');
    }
    const leaveRequest = yield prisma_1.default.leaveRequest.create({
        data: {
            userId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: client_1.LeaveStatus.PENDING
        }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, leaveRequest, 'Leave request submitted successfully'));
}));
exports.getLeaveRequests = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    const userId = req.user.id;
    let where = {};
    // If not admin/principal/accountant, only see own requests
    if (role !== 'ADMIN' && role !== 'PRINCIPAL' && role !== 'ACCOUNTANT') {
        where = { userId };
    }
    const leaveRequests = yield prisma_1.default.leaveRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, role: true }
            }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, leaveRequests, 'Leave requests retrieved successfully'));
}));
exports.updateLeaveStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED
    if (!Object.values(client_1.LeaveStatus).includes(status)) {
        throw new apiError_1.ApiError(400, 'Invalid status');
    }
    const leaveRequest = yield prisma_1.default.leaveRequest.update({
        where: { id: parseInt(id, 10) },
        data: { status }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, leaveRequest, `Leave request ${status.toLowerCase()}`));
}));
// ---------------------------------------------------------
// PAYROLL GENERATION
// ---------------------------------------------------------
exports.generatePayroll = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, year } = req.body;
    if (!month || !year) {
        throw new apiError_1.ApiError(400, 'Month and Year are required');
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const totalDaysInMonth = endDate.getDate();
    // Get all staff with salaries configured
    const staffMembers = yield prisma_1.default.user.findMany({
        where: {
            role: {
                in: ['TEACHER', 'STAFF', 'LIBRARIAN', 'ACCOUNTANT', 'CLERK', 'SECURITY', 'CLEANER']
            },
            salary: {
                isNot: null
            }
        },
        include: {
            salary: true,
            staffAttendances: {
                where: {
                    date: { gte: startDate, lte: endDate },
                    status: client_1.AttendanceStatus.ABSENT
                }
            },
            leaveRequests: {
                where: {
                    status: client_1.LeaveStatus.APPROVED,
                    startDate: { lte: endDate },
                    endDate: { gte: startDate }
                }
            }
        }
    });
    const generatedRecords = [];
    for (const staff of staffMembers) {
        if (!staff.salary)
            continue;
        const baseSalary = staff.salary.baseSalary;
        const allowances = staff.salary.allowances;
        const standardDeductions = staff.salary.deductions;
        // Calculate absent days
        // Simplified logic: Count ABSENT days.
        // In a real system, you might check if absent day falls within an APPROVED LeaveRequest.
        // For this prototype, we'll assume any ABSENT mark without an approved leave covering that date is unpaid.
        let unpaidAbsentDays = 0;
        for (const attendance of staff.staffAttendances) {
            // Check if this date is covered by an approved leave
            const isCoveredByLeave = staff.leaveRequests.some(leave => {
                return attendance.date >= leave.startDate && attendance.date <= leave.endDate;
            });
            if (!isCoveredByLeave) {
                unpaidAbsentDays++;
            }
        }
        // Daily wage
        const dailyWage = baseSalary / totalDaysInMonth;
        const absentDeduction = dailyWage * unpaidAbsentDays;
        const totalDeductions = standardDeductions + absentDeduction;
        const netPay = baseSalary + allowances - totalDeductions;
        // Upsert the payroll record for the month
        const record = yield prisma_1.default.payrollRecord.upsert({
            where: {
                userId_month_year: {
                    userId: staff.id,
                    month: parseInt(month, 10),
                    year: parseInt(year, 10)
                }
            },
            update: {
                baseSalary,
                allowances,
                deductions: totalDeductions,
                netPay: Math.max(0, netPay),
                status: 'PENDING'
            },
            create: {
                userId: staff.id,
                month: parseInt(month, 10),
                year: parseInt(year, 10),
                baseSalary,
                allowances,
                deductions: totalDeductions,
                netPay: Math.max(0, netPay),
                status: 'PENDING'
            }
        });
        generatedRecords.push(record);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, generatedRecords, `Payroll generated for ${month}/${year}`));
}));
exports.getPayrollRecords = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, year, userId } = req.query;
    let where = {};
    if (month)
        where.month = parseInt(month, 10);
    if (year)
        where.year = parseInt(year, 10);
    if (userId)
        where.userId = parseInt(userId, 10);
    const records = yield prisma_1.default.payrollRecord.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, role: true }
            }
        },
        orderBy: [
            { year: 'desc' },
            { month: 'desc' },
            { user: { name: 'asc' } }
        ]
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, records, 'Payroll records retrieved successfully'));
}));
exports.paySalary = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    const record = yield prisma_1.default.payrollRecord.update({
        where: { id },
        data: {
            status: 'PAID',
            paymentDate: new Date(),
            paymentMethod: paymentMethod || 'BANK_TRANSFER'
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, record, 'Salary marked as paid'));
}));
exports.downloadSalarySlip = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const record = yield prisma_1.default.payrollRecord.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, role: true }
            }
        }
    });
    if (!record) {
        throw new apiError_1.ApiError(404, 'Payroll record not found');
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findFirst();
    const html = (0, salarySlipHtmlGenerator_1.generateSalarySlipHtml)(record, schoolProfile);
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    const fileName = (record.user.name || 'Staff').replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=salary_slip_${fileName}_${record.month}_${record.year}.pdf`);
    res.send(pdfBuffer);
}));
