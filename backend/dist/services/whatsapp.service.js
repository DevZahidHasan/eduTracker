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
exports.sendPaymentConfirmationWhatsApp = exports.sendVoucherWhatsAppNotification = exports.sendParentAttendanceWhatsApp = exports.sendWhatsAppMessage = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const twilio_1 = __importDefault(require("twilio"));
/**
 * WhatsApp Service
 * Dynamically switches between Real Twilio API and Mock Logging
 */
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
const isTwilioConfigured = TWILIO_SID && TWILIO_TOKEN && TWILIO_NUMBER;
const sendWhatsAppMessage = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (isTwilioConfigured) {
        try {
            const client = (0, twilio_1.default)(TWILIO_SID, TWILIO_TOKEN);
            yield client.messages.create({
                from: TWILIO_NUMBER,
                to: `whatsapp:${to.replace(/\s+/g, '')}`, // Remove spaces for API
                body: message
            });
            console.log(`[REAL WHATSAPP] Message sent to ${to}`);
            return true;
        }
        catch (error) {
            console.error('[REAL WHATSAPP ERROR] Failed to send message:', error);
            return false;
        }
    }
    else {
        // FALLBACK TO MOCK FOR DEVELOPMENT
        console.log(`[WHATSAPP MOCK] Sending message to ${to}: ${message}`);
        return true;
    }
});
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const sendParentAttendanceWhatsApp = (attendanceId) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield prisma_1.default.systemSetting.findUnique({
        where: { key: 'parentNotificationsWhatsApp' }
    });
    if ((settings === null || settings === void 0 ? void 0 : settings.value) !== 'true')
        return;
    const attendance = yield prisma_1.default.attendance.findUnique({
        where: { id: attendanceId },
        include: { student: true }
    });
    if (!attendance || !attendance.student.parentPhone) {
        return;
    }
    const { student, status, date } = attendance;
    const message = `EduTrack Academy: Attendance Alert for ${student.fullName}. Status: ${status} on ${date.toLocaleDateString()}.`;
    yield (0, exports.sendWhatsAppMessage)(student.parentPhone, message);
});
exports.sendParentAttendanceWhatsApp = sendParentAttendanceWhatsApp;
const sendVoucherWhatsAppNotification = (voucherId) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield prisma_1.default.systemSetting.findUnique({
        where: { key: 'feeNotificationsWhatsApp' }
    });
    if ((settings === null || settings === void 0 ? void 0 : settings.value) !== 'true')
        return;
    const voucher = yield prisma_1.default.feeVoucher.findUnique({
        where: { id: voucherId },
        include: { student: true }
    });
    if (!voucher || !voucher.student.parentPhone)
        return;
    const monthName = new Date(0, voucher.month - 1).toLocaleString('default', { month: 'long' });
    const message = `EduTrack Academy: Fee Voucher issued for ${voucher.student.fullName} (${monthName} ${voucher.year}). Amount: $${voucher.totalAmount.toLocaleString()}. Due Date: ${voucher.dueDate.toLocaleDateString()}.`;
    yield (0, exports.sendWhatsAppMessage)(voucher.student.parentPhone, message);
});
exports.sendVoucherWhatsAppNotification = sendVoucherWhatsAppNotification;
const sendPaymentConfirmationWhatsApp = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const settings = yield prisma_1.default.systemSetting.findUnique({
        where: { key: 'feeNotificationsWhatsApp' }
    });
    if ((settings === null || settings === void 0 ? void 0 : settings.value) !== 'true')
        return;
    const payment = yield prisma_1.default.feePayment.findUnique({
        where: { id: paymentId },
        include: {
            student: true,
            voucher: true
        }
    });
    if (!payment || !((_a = payment.student) === null || _a === void 0 ? void 0 : _a.parentPhone))
        return;
    const message = `EduTrack Academy: Payment Received! $${payment.amount.toLocaleString()} for ${payment.student.fullName}. Thank you for your payment.`;
    yield (0, exports.sendWhatsAppMessage)(payment.student.parentPhone, message);
});
exports.sendPaymentConfirmationWhatsApp = sendPaymentConfirmationWhatsApp;
