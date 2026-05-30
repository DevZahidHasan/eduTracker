import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';

export const getParentDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  // 1. Find all students linked to this parent
  const students = await prisma.student.findMany({
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
  const dashboardData = await Promise.all(students.map(async (student) => {
    // A. Today's Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today
        }
      },
      select: { status: true }
    });

    // B. Unpaid Fee Vouchers
    const unpaidVouchers = await prisma.feeVoucher.findMany({
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
    const recentReports = await prisma.termResult.findMany({
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
      attendanceToday: todayAttendance?.status || 'NOT_MARKED',
      unpaidVouchers,
      totalDue: unpaidVouchers.reduce((sum, v) => sum + v.totalAmount, 0),
      latestResult: recentReports.length > 0 ? recentReports[0] : null
    };
  }));

  return res.status(200).json(
    new ApiResponse(200, dashboardData, 'Parent dashboard data fetched successfully')
  );
});
