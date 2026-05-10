import nodemailer from 'nodemailer';
import prisma from '../prisma';

// Use a test account or environment variables for real credentials
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER || 'test@ethereal.email',
      pass: process.env.SMTP_PASS || 'testpassword',
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
