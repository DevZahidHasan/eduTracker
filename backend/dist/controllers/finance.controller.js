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
exports.getFinanceStats = exports.exportVoucherReceiptPdf = exports.collectPayment = exports.deleteVoucher = exports.getVouchers = exports.getStudentVouchers = exports.generateMonthlyVouchers = exports.upsertFeeStructure = exports.getFeeStructures = exports.deleteFeeType = exports.updateFeeType = exports.createFeeType = exports.getFeeTypes = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = __importDefault(require("../prisma"));
const receiptHtmlGenerator_1 = require("../utils/receiptHtmlGenerator");
const pdfGenerator_1 = require("../utils/pdfGenerator");
const email_service_1 = require("../services/email.service");
const whatsapp_service_1 = require("../services/whatsapp.service");
// --- Fee Types ---
exports.getFeeTypes = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feeTypes = yield prisma_1.default.feeType.findMany({
        orderBy: { name: 'asc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, feeTypes, 'Fee types fetched successfully'));
}));
exports.createFeeType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, isMonthly } = req.body;
    if (!name)
        throw new apiError_1.ApiError(400, 'Name is required');
    const feeType = yield prisma_1.default.feeType.create({
        data: { name, isMonthly }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, feeType, 'Fee type created successfully'));
}));
exports.updateFeeType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, isMonthly } = req.body;
    const feeType = yield prisma_1.default.feeType.update({
        where: { id: Number(id) },
        data: { name, isMonthly }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, feeType, 'Fee type updated successfully'));
}));
exports.deleteFeeType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.feeType.delete({ where: { id: Number(id) } });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Fee type deleted successfully'));
}));
// --- Fee Structures ---
exports.getFeeStructures = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className } = req.query;
    const where = {};
    if (className)
        where.className = className;
    const structures = yield prisma_1.default.feeStructure.findMany({
        where,
        include: { feeType: true }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, structures, 'Fee structures fetched successfully'));
}));
exports.upsertFeeStructure = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, feeTypeId, amount } = req.body;
    if (!className || !feeTypeId || amount === undefined) {
        throw new apiError_1.ApiError(400, 'Class name, Fee Type ID and Amount are required');
    }
    const structure = yield prisma_1.default.feeStructure.upsert({
        where: {
            className_feeTypeId: {
                className,
                feeTypeId: Number(feeTypeId)
            }
        },
        update: { amount: parseFloat(amount) },
        create: {
            className,
            feeTypeId: Number(feeTypeId),
            amount: parseFloat(amount)
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, structure, 'Fee structure updated successfully'));
}));
// --- Fee Vouchers ---
exports.generateMonthlyVouchers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, month, year, dueDate } = req.body;
    if (!className || !month || !year || !dueDate) {
        throw new apiError_1.ApiError(400, 'Class, month, year and due date are required');
    }
    // 1. Get all students in the class
    const students = yield prisma_1.default.student.findMany({
        where: { className },
        include: { busRoute: true, busStop: true }
    });
    if (students.length === 0) {
        throw new apiError_1.ApiError(404, 'No students found in this class');
    }
    // 2. Get the fee structure for this class - ONLY include Monthly/Recurring fees
    // IMPORTANT: We filter out 'Transport Fee' because it is managed dynamically by the Transport Module
    const allMonthlyStructures = yield prisma_1.default.feeStructure.findMany({
        where: {
            className,
            feeType: { isMonthly: true }
        },
        include: { feeType: true }
    });
    const structures = allMonthlyStructures.filter(s => s.feeType.name !== 'Transport Fee');
    // Ensure Transport FeeType exists for the system to use
    let transportFeeType = yield prisma_1.default.feeType.findFirst({ where: { name: 'Transport Fee' } });
    if (!transportFeeType) {
        transportFeeType = yield prisma_1.default.feeType.create({
            data: { name: 'Transport Fee', isMonthly: true }
        });
    }
    if (structures.length === 0 && students.every(s => !s.busRouteId && !s.busStopId)) {
        throw new apiError_1.ApiError(400, 'No monthly fee structures defined for this class. Please set recurring fees first.');
    }
    // 3. Generate vouchers for each student
    const results = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const createdVouchers = [];
        for (const student of students) {
            const existing = yield tx.feeVoucher.findFirst({
                where: {
                    studentId: student.id,
                    month: Number(month),
                    year: Number(year)
                }
            });
            if (existing)
                continue;
            let totalAmount = structures.reduce((sum, s) => sum + s.amount, 0);
            const itemsData = structures.map(s => ({
                feeTypeId: s.feeTypeId,
                amount: s.amount
            }));
            // Add transport fee if assigned
            if (student.busRouteId || student.busStopId) {
                const routeFare = ((_a = student.busRoute) === null || _a === void 0 ? void 0 : _a.fare) || 0;
                const stopExtraFare = ((_b = student.busStop) === null || _b === void 0 ? void 0 : _b.fare) || 0;
                const totalTransportFare = routeFare + stopExtraFare;
                if (totalTransportFare > 0 && transportFeeType) {
                    totalAmount += totalTransportFare;
                    itemsData.push({
                        feeTypeId: transportFeeType.id,
                        amount: totalTransportFare
                    });
                }
            }
            if (itemsData.length === 0)
                continue;
            const voucher = yield tx.feeVoucher.create({
                data: {
                    studentId: student.id,
                    month: Number(month),
                    year: Number(year),
                    dueDate: new Date(dueDate),
                    totalAmount,
                    status: 'UNPAID',
                    items: {
                        create: itemsData
                    }
                }
            });
            createdVouchers.push(voucher);
        }
        return createdVouchers;
    }));
    // 4. Send email notifications (Async)
    results.forEach(voucher => {
        (0, email_service_1.sendVoucherGenerationNotification)(voucher.id).catch(err => console.error('Email failed:', err));
        (0, whatsapp_service_1.sendVoucherWhatsAppNotification)(voucher.id).catch(err => console.error('WhatsApp failed:', err));
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, { count: results.length }, `${results.length} vouchers generated successfully`));
}));
exports.getStudentVouchers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const vouchers = yield prisma_1.default.feeVoucher.findMany({
        where: { studentId: Number(studentId) },
        include: { items: { include: { feeType: true } }, payments: true },
        orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, vouchers, 'Student vouchers fetched successfully'));
}));
exports.getVouchers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, studentId, month, year, status } = req.query;
    const where = {};
    if (className)
        where.student = { className: className };
    if (studentId)
        where.studentId = Number(studentId);
    if (month)
        where.month = Number(month);
    if (year)
        where.year = Number(year);
    if (status)
        where.status = status;
    const vouchers = yield prisma_1.default.feeVoucher.findMany({
        where,
        include: {
            student: { select: { fullName: true, rollNumber: true, className: true, section: true, studentId: true } },
            items: { include: { feeType: true } },
            payments: true
        },
        orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, vouchers, 'Vouchers fetched successfully'));
}));
exports.deleteVoucher = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.feeVoucher.delete({ where: { id } });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Voucher deleted successfully'));
}));
exports.collectPayment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { voucherId, amount, paymentMethod, transactionId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!voucherId || !amount || !paymentMethod) {
        throw new apiError_1.ApiError(400, 'Voucher ID, amount and payment method are required');
    }
    const voucher = yield prisma_1.default.feeVoucher.findUnique({
        where: { id: voucherId },
        include: { student: true }
    });
    if (!voucher)
        throw new apiError_1.ApiError(404, 'Voucher not found');
    const newPaidAmount = voucher.paidAmount + parseFloat(amount);
    let status = 'PARTIAL';
    if (newPaidAmount >= voucher.totalAmount)
        status = 'PAID';
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.feePayment.create({
            data: {
                voucherId,
                studentId: voucher.studentId,
                amount: parseFloat(amount),
                paymentMethod,
                transactionId,
                receivedBy: userId || 1
            }
        });
        yield tx.feeVoucher.update({
            where: { id: voucherId },
            data: {
                paidAmount: newPaidAmount,
                status
            }
        });
        return payment;
    }));
    // 4. Send payment confirmation (Async)
    (0, email_service_1.sendPaymentConfirmationNotification)(result.id).catch(err => console.error('Payment email failed:', err));
    (0, whatsapp_service_1.sendPaymentConfirmationWhatsApp)(result.id).catch(err => console.error('Payment WhatsApp failed:', err));
    return res.status(201).json(new apiResponse_1.ApiResponse(201, result, 'Payment recorded successfully'));
}));
exports.exportVoucherReceiptPdf = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const voucher = yield prisma_1.default.feeVoucher.findUnique({
        where: { id },
        include: {
            student: true,
            payments: {
                orderBy: { paymentDate: 'desc' }
            },
            items: {
                include: { feeType: true }
            }
        }
    });
    if (!voucher) {
        throw new apiError_1.ApiError(404, 'Voucher not found');
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findUnique({ where: { id: 1 } });
    const html = (0, receiptHtmlGenerator_1.generateReceiptHtml)(voucher, schoolProfile);
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt_${voucher.student.fullName.replace(/\s+/g, '_')}_${voucher.month}_${voucher.year}.pdf`);
    return res.send(pdfBuffer);
}));
exports.getFinanceStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalVouchers = yield prisma_1.default.feeVoucher.count();
    const paidVouchers = yield prisma_1.default.feeVoucher.count({ where: { status: 'PAID' } });
    const revenueResult = yield prisma_1.default.feeVoucher.aggregate({
        _sum: { totalAmount: true, paidAmount: true }
    });
    const stats = {
        totalBilled: revenueResult._sum.totalAmount || 0,
        totalCollected: revenueResult._sum.paidAmount || 0,
        totalPending: (revenueResult._sum.totalAmount || 0) - (revenueResult._sum.paidAmount || 0),
        collectionRate: revenueResult._sum.totalAmount ? ((revenueResult._sum.paidAmount || 0) / revenueResult._sum.totalAmount) * 100 : 0,
        voucherStats: {
            total: totalVouchers,
            paid: paidVouchers,
            pending: totalVouchers - paidVouchers
        }
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, stats, 'Finance statistics fetched successfully'));
}));
