import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { AttendanceStatus, LeaveStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { generatePdfFromHtml } from '../utils/pdfGenerator';
import { generateSalarySlipHtml } from '../utils/salarySlipHtmlGenerator';

// ---------------------------------------------------------
// STAFF MANAGEMENT
// ---------------------------------------------------------

export const getStaffMembers = asyncHandler(async (req: Request, res: Response) => {
  const staff = await prisma.user.findMany({
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

  return res.status(200).json(new ApiResponse(200, staff, 'Staff members retrieved successfully'));
});

export const updateStaffSalary = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { baseSalary, allowances, deductions } = req.body;

  if (baseSalary === undefined) {
    throw new ApiError(400, 'Base salary is required');
  }

  const salary = await prisma.staffSalary.upsert({
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

  return res.status(200).json(new ApiResponse(200, salary, 'Staff salary updated successfully'));
});

// ---------------------------------------------------------
// ATTENDANCE
// ---------------------------------------------------------

export const markStaffAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { date, records } = req.body;
  // records: { userId: number, status: AttendanceStatus, remarks?: string }[]

  if (!date || !records || !Array.isArray(records)) {
    throw new ApiError(400, 'Invalid data. Date and records array are required.');
  }

  const attendanceDate = new Date(date);

  const results = await prisma.$transaction(
    records.map((record: any) =>
      prisma.staffAttendance.upsert({
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
      })
    )
  );

  return res.status(200).json(new ApiResponse(200, results, 'Staff attendance marked successfully'));
});

export const getStaffAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { date, month, year } = req.query;

  let where: any = {};

  if (date) {
    const searchDate = new Date(date as string);
    searchDate.setUTCHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setUTCDate(searchDate.getUTCDate() + 1);
    
    where.date = {
      gte: searchDate,
      lt: nextDate
    };
  } else if (month && year) {
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
    where.date = {
      gte: startDate,
      lte: endDate
    };
  }

  const attendance = await prisma.staffAttendance.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, role: true }
      }
    }
  });

  return res.status(200).json(new ApiResponse(200, attendance, 'Attendance retrieved successfully'));
});

// ---------------------------------------------------------
// LEAVE REQUESTS
// ---------------------------------------------------------

export const applyForLeave = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate, reason } = req.body;
  const userId = req.user!.id;

  if (!startDate || !endDate || !reason) {
    throw new ApiError(400, 'Start date, end date, and reason are required');
  }

  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: LeaveStatus.PENDING
    }
  });

  return res.status(201).json(new ApiResponse(201, leaveRequest, 'Leave request submitted successfully'));
});

export const getLeaveRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user!.role;
  const userId = req.user!.id;

  let where = {};
  // If not admin/principal/accountant, only see own requests
  if (role !== 'ADMIN' && role !== 'PRINCIPAL' && role !== 'ACCOUNTANT') {
    where = { userId };
  }

  const leaveRequests = await prisma.leaveRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, role: true }
      }
    }
  });

  return res.status(200).json(new ApiResponse(200, leaveRequests, 'Leave requests retrieved successfully'));
});

export const updateLeaveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // APPROVED or REJECTED

  if (!Object.values(LeaveStatus).includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const leaveRequest = await prisma.leaveRequest.update({
    where: { id: parseInt(id, 10) },
    data: { status }
  });

  return res.status(200).json(new ApiResponse(200, leaveRequest, `Leave request ${status.toLowerCase()}`));
});

// ---------------------------------------------------------
// PAYROLL GENERATION
// ---------------------------------------------------------

export const generatePayroll = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.body;

  if (!month || !year) {
    throw new ApiError(400, 'Month and Year are required');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const totalDaysInMonth = endDate.getDate();

  // Get all staff with salaries configured
  const staffMembers = await prisma.user.findMany({
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
          status: AttendanceStatus.ABSENT
        }
      },
      leaveRequests: {
        where: {
          status: LeaveStatus.APPROVED,
          startDate: { lte: endDate },
          endDate: { gte: startDate }
        }
      }
    }
  });

  const generatedRecords = [];

  for (const staff of staffMembers) {
    if (!staff.salary) continue;

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
    const record = await prisma.payrollRecord.upsert({
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

  return res.status(200).json(new ApiResponse(200, generatedRecords, `Payroll generated for ${month}/${year}`));
});

export const getPayrollRecords = asyncHandler(async (req: Request, res: Response) => {
  const { month, year, userId } = req.query;

  let where: any = {};
  if (month) where.month = parseInt(month as string, 10);
  if (year) where.year = parseInt(year as string, 10);
  if (userId) where.userId = parseInt(userId as string, 10);

  const records = await prisma.payrollRecord.findMany({
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

  return res.status(200).json(new ApiResponse(200, records, 'Payroll records retrieved successfully'));
});

export const paySalary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;

  const record = await prisma.payrollRecord.update({
    where: { id },
    data: {
      status: 'PAID',
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'BANK_TRANSFER'
    }
  });

  return res.status(200).json(new ApiResponse(200, record, 'Salary marked as paid'));
});

export const downloadSalarySlip = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const record = await prisma.payrollRecord.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, role: true }
      }
    }
  });

  if (!record) {
    throw new ApiError(404, 'Payroll record not found');
  }

  const schoolProfile = await prisma.schoolProfile.findFirst();
  const html = generateSalarySlipHtml(record, schoolProfile);
  const pdfBuffer = await generatePdfFromHtml(html);

  const fileName = (record.user.name || 'Staff').replace(/\s+/g, '_');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=salary_slip_${fileName}_${record.month}_${record.year}.pdf`);
  res.send(pdfBuffer);
});
