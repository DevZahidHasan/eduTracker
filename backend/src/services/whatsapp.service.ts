import prisma from '../prisma';
import twilio from 'twilio';

/**
 * WhatsApp Service
 * Dynamically switches between Real Twilio API and Mock Logging
 */

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

const isTwilioConfigured = TWILIO_SID && TWILIO_TOKEN && TWILIO_NUMBER;

export const sendWhatsAppMessage = async (to: string, message: string) => {
  if (isTwilioConfigured) {
    try {
      const client = twilio(TWILIO_SID, TWILIO_TOKEN);
      await client.messages.create({
        from: TWILIO_NUMBER,
        to: `whatsapp:${to.replace(/\s+/g, '')}`, // Remove spaces for API
        body: message
      });
      // log removed
      return true;
    } catch (error) {
      console.error('[REAL WHATSAPP ERROR] Failed to send message:', error);
      return false;
    }
  } else {
    // FALLBACK TO MOCK FOR DEVELOPMENT
    return true;
  }
};

export const sendParentAttendanceWhatsApp = async (attendanceId: number) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'parentNotificationsWhatsApp' }
  });

  if (settings?.value !== 'true') return;

  const attendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
    include: { student: true }
  });

  if (!attendance || !attendance.student.parentPhone) {
    return;
  }

  const { student, status, date } = attendance;
  const message = `EduTrack Academy: Attendance Alert for ${student.fullName}. Status: ${status} on ${date.toLocaleDateString()}.`;

  await sendWhatsAppMessage(student.parentPhone as string, message);
};

export const sendVoucherWhatsAppNotification = async (voucherId: string) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'feeNotificationsWhatsApp' }
  });

  if (settings?.value !== 'true') return;

  const voucher = await prisma.feeVoucher.findUnique({
    where: { id: voucherId },
    include: { student: true }
  });

  if (!voucher || !voucher.student.parentPhone) return;

  const monthName = new Date(0, voucher.month - 1).toLocaleString('default', { month: 'long' });
  const message = `EduTrack Academy: Fee Voucher issued for ${voucher.student.fullName} (${monthName} ${voucher.year}). Amount: $${voucher.totalAmount.toLocaleString()}. Due Date: ${voucher.dueDate.toLocaleDateString()}.`;

  await sendWhatsAppMessage(voucher.student.parentPhone as string, message);
};

export const sendPaymentConfirmationWhatsApp = async (paymentId: string) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'feeNotificationsWhatsApp' }
  });

  if (settings?.value !== 'true') return;

  const payment: any = await prisma.feePayment.findUnique({
    where: { id: paymentId },
    include: { 
      student: true, 
      voucher: true 
    }
  });

  if (!payment || !payment.student?.parentPhone) return;

  const message = `EduTrack Academy: Payment Received! $${payment.amount.toLocaleString()} for ${payment.student.fullName}. Thank you for your payment.`;

  await sendWhatsAppMessage(payment.student.parentPhone as string, message);
};
