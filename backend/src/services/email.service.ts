import nodemailer from 'nodemailer';
import prisma from '../prisma';

// Use a test account or environment variables for real credentials
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });
};

export const sendDailyAttendanceReport = async () => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'attendanceAlerts' }
  });

  if (settings?.value !== 'true') {
    console.log('Attendance alerts are disabled in settings. Skipping daily report.');
    return;
  }

  const transporter = getTransporter();

  // In a real application, you would fetch attendance data for today
  // and format it nicely. We'll send a summary to admins.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendances = await prisma.attendance.findMany({
    where: { date: today },
    include: { student: true }
  });

  const present = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const absent = attendances.filter(a => a.status === 'ABSENT').length;
  const total = attendances.length;

  const html = `
    <h2>Daily Attendance Summary</h2>
    <p>Date: ${today.toLocaleDateString()}</p>
    <ul>
      <li>Total Recorded: ${total}</li>
      <li>Present/Late: ${present}</li>
      <li>Absent: ${absent}</li>
    </ul>
    <p>This is a computer-generated document by EduTrack AI.</p>
  `;

  // Fetch admin users to send the report to
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  const adminEmails = admins.map(a => a.email).filter(Boolean);

  if (adminEmails.length === 0) {
      console.log('No admins found to send report to.');
      return;
  }

  try {
    const info = await transporter.sendMail({
      from: '"EduTrack AI" <noreply@edutrack.ai>',
      to: adminEmails.join(','),
      subject: `Daily Attendance Report - ${today.toLocaleDateString()}`,
      html,
    });
    console.log('Daily report sent: %s', info.messageId);
    
    // Log preview URL if using ethereal email
    if (info.messageId && process.env.SMTP_HOST === undefined) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending daily report:', error);
  }
};

export const sendParentAttendanceNotification = async (attendanceId: number) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'parentNotifications' }
  });

  if (settings?.value !== 'true') {
    return;
  }

  const attendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
    include: { student: true }
  });

  if (!attendance || !attendance.student.email) {
    return;
  }

  const transporter = getTransporter();
  const { student, status, date } = attendance;
  const recipientEmail = student.email as string;

  const statusText = status === 'ABSENT' ? '<span style="color: red; font-weight: bold;">ABSENT</span>' : 
                    status === 'PRESENT' ? '<span style="color: green; font-weight: bold;">PRESENT</span>' : 
                    status;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #2563eb;">Attendance Update</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is to inform you about the attendance status of <strong>${student.fullName}</strong> (Roll: ${student.rollNumber}) for <strong>${date.toLocaleDateString()}</strong>.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 18px;">Status: ${statusText}</p>
      </div>

      <p>If you have any questions, please contact the school administration.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated message from EduTrack AI.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"EduTrack AI" <noreply@edutrack.ai>',
      to: recipientEmail,
      subject: `Attendance Notification: ${student.fullName} - ${status}`,
      html,
    });
    console.log(`Parent notification sent for student ${student.fullName}`);
  } catch (error) {
    console.error('Error sending parent notification:', error);
  }
};

export const sendMarkFinalizationAlert = async (className: string, subject: string, examType: string, lockedBy: string) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'marksAlerts' }
  });

  if (settings?.value !== 'true') {
    return;
  }

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true }
  });

  if (admins.length === 0) {
    return;
  }

  const transporter = getTransporter();
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #2563eb;">Marks Finalized</h2>
      <p>Hello Admin,</p>
      <p>The examination marks have been finalized and locked for the following:</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Class:</strong> ${className}</p>
        <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin: 5px 0;"><strong>Exam:</strong> ${examType}</p>
        <p style="margin: 5px 0;"><strong>Finalized By:</strong> ${lockedBy}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <p>These marks are now locked for regular editing. Only administrators can unlock them if changes are required.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated notification from EduTrack AI.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"EduTrack AI" <noreply@edutrack.ai>',
      to: admins.map(a => a.email).join(', '),
      subject: `[ALERT] Marks Finalized: ${className} - ${subject} - ${examType}`,
      html,
    });
    console.log(`Mark finalization alert sent to ${admins.length} admins`);
  } catch (error) {
    console.error('Error sending mark finalization alert:', error);
  }
};

export const sendVoucherGenerationNotification = async (voucherId: string) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'feeNotifications' }
  });

  if (settings?.value !== 'true') return;

  const voucher = await prisma.feeVoucher.findUnique({
    where: { id: voucherId },
    include: { student: true }
  });

  if (!voucher || !voucher.student.email) return;

  const transporter = getTransporter();
  const monthName = new Date(0, voucher.month - 1).toLocaleString('default', { month: 'long' });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #2563eb;">New Fee Voucher Issued</h2>
      <p>Dear Parent/Guardian,</p>
      <p>A new fee voucher has been issued for <strong>${voucher.student.fullName}</strong> for the month of <strong>${monthName} ${voucher.year}</strong>.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Voucher ID:</strong> ${voucher.id.substring(0, 8).toUpperCase()}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${voucher.totalAmount.toLocaleString()}</p>
        <p style="margin: 5px 0; color: #ef4444;"><strong>Due Date:</strong> ${voucher.dueDate.toLocaleDateString()}</p>
      </div>

      <p>Please ensure the payment is made before the due date to avoid late fees.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated message from EduTrack Academy.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"EduTrack Academy" <noreply@edutrack.ai>',
      to: voucher.student.email,
      subject: `Fee Voucher Issued: ${monthName} ${voucher.year} - ${voucher.student.fullName}`,
      html,
    });
    console.log(`Voucher notification sent to ${voucher.student.email}`);
  } catch (error) {
    console.error('Error sending voucher notification:', error);
  }
};

export const sendPaymentConfirmationNotification = async (paymentId: string) => {
  const settings = await prisma.systemSetting.findUnique({
    where: { key: 'feeNotifications' }
  });

  if (settings?.value !== 'true') return;

  const payment: any = await prisma.feePayment.findUnique({
    where: { id: paymentId },
    include: { 
      student: true, 
      voucher: true 
    }
  });

  if (!payment || !payment.student?.email) return;

  const transporter = getTransporter();
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #059669;">Payment Confirmation</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is to confirm that we have successfully received a payment of <strong>$${payment.amount.toLocaleString()}</strong> for <strong>${payment.student.fullName}</strong>.</p>
      
      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${payment.transactionId || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${new Date(payment.paymentDate).toLocaleString()}</p>
        <p style="margin: 5px 0;"><strong>Voucher Status:</strong> <span style="font-weight: bold;">${payment.voucher?.status}</span></p>
        <p style="margin: 5px 0;"><strong>Remaining Balance:</strong> $${(payment.voucher?.totalAmount - payment.voucher?.paidAmount).toLocaleString()}</p>
      </div>

      <p>Thank you for your timely payment.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated message from EduTrack Academy.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"EduTrack Academy" <noreply@edutrack.ai>',
      to: payment.student.email,
      subject: `Payment Confirmation: $${payment.amount} - ${payment.student.fullName}`,
      html,
    });
    console.log(`Payment confirmation sent to ${payment.student.email}`);
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
  }
};
