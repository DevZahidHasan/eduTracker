import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import prisma from '../prisma';
import { generateReceiptHtml } from '../utils/receiptHtmlGenerator';
import { generatePdfFromHtml } from '../utils/pdfGenerator';

// --- Fee Types ---

export const getFeeTypes = asyncHandler(async (req: Request, res: Response) => {
  const feeTypes = await prisma.feeType.findMany({
    orderBy: { name: 'asc' }
  });
  return res.status(200).json(new ApiResponse(200, feeTypes, 'Fee types fetched successfully'));
});

export const createFeeType = asyncHandler(async (req: Request, res: Response) => {
  const { name, isMonthly } = req.body;
  
  if (!name) throw new ApiError(400, 'Name is required');

  const feeType = await prisma.feeType.create({
    data: { name, isMonthly }
  });
  return res.status(201).json(new ApiResponse(201, feeType, 'Fee type created successfully'));
});

export const updateFeeType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, isMonthly } = req.body;

  const feeType = await prisma.feeType.update({
    where: { id: Number(id) },
    data: { name, isMonthly }
  });
  return res.status(200).json(new ApiResponse(200, feeType, 'Fee type updated successfully'));
});

export const deleteFeeType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.feeType.delete({ where: { id: Number(id) } });
  return res.status(200).json(new ApiResponse(200, null, 'Fee type deleted successfully'));
});

// --- Fee Structures ---

export const getFeeStructures = asyncHandler(async (req: Request, res: Response) => {
  const { className } = req.query;
  const where: any = {};
  if (className) where.className = className as string;

  const structures = await prisma.feeStructure.findMany({
    where,
    include: { feeType: true }
  });
  return res.status(200).json(new ApiResponse(200, structures, 'Fee structures fetched successfully'));
});

export const upsertFeeStructure = asyncHandler(async (req: Request, res: Response) => {
  const { className, feeTypeId, amount } = req.body;

  if (!className || !feeTypeId || amount === undefined) {
    throw new ApiError(400, 'Class name, Fee Type ID and Amount are required');
  }

  const structure = await prisma.feeStructure.upsert({
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

  return res.status(200).json(new ApiResponse(200, structure, 'Fee structure updated successfully'));
});

// --- Fee Vouchers ---

export const generateMonthlyVouchers = asyncHandler(async (req: Request, res: Response) => {
  const { className, month, year, dueDate } = req.body;

  if (!className || !month || !year || !dueDate) {
    throw new ApiError(400, 'Class, month, year and due date are required');
  }

  // 1. Get all students in the class
  const students = await prisma.student.findMany({
    where: { className }
  });

  if (students.length === 0) {
    throw new ApiError(404, 'No students found in this class');
  }

  // 2. Get the fee structure for this class - ONLY include Monthly/Recurring fees
  const structures = await prisma.feeStructure.findMany({
    where: { 
      className,
      feeType: { isMonthly: true } 
    },
    include: { feeType: true }
  });

  if (structures.length === 0) {
    throw new ApiError(400, 'No monthly fee structures defined for this class. Please set recurring fees first.');
  }

  // 3. Generate vouchers for each student
  const results = await prisma.$transaction(async (tx) => {
    const createdVouchers = [];

    for (const student of students) {
      const existing = await tx.feeVoucher.findFirst({
        where: {
          studentId: student.id,
          month: Number(month),
          year: Number(year)
        }
      });

      if (existing) continue;

      const totalAmount = structures.reduce((sum, s) => sum + s.amount, 0);

      const voucher = await tx.feeVoucher.create({
        data: {
          studentId: student.id,
          month: Number(month),
          year: Number(year),
          dueDate: new Date(dueDate),
          totalAmount,
          status: 'UNPAID',
          items: {
            create: structures.map(s => ({
              feeTypeId: s.feeTypeId,
              amount: s.amount
            }))
          }
        }
      });
      createdVouchers.push(voucher);
    }
    return createdVouchers;
  });

  return res.status(201).json(new ApiResponse(201, { count: results.length }, `${results.length} vouchers generated successfully`));
});

export const getStudentVouchers = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const vouchers = await prisma.feeVoucher.findMany({
    where: { studentId: Number(studentId) },
    include: { items: { include: { feeType: true } }, payments: true },
    orderBy: { createdAt: 'desc' }
  });
  return res.status(200).json(new ApiResponse(200, vouchers, 'Student vouchers fetched successfully'));
});

export const getVouchers = asyncHandler(async (req: Request, res: Response) => {
  const { className, studentId, month, year, status } = req.query;
  const where: any = {};

  if (className) where.student = { className: className as string };
  if (studentId) where.studentId = Number(studentId);
  if (month) where.month = Number(month);
  if (year) where.year = Number(year);
  if (status) where.status = status as string;

  const vouchers = await prisma.feeVoucher.findMany({
    where,
    include: {
      student: { select: { fullName: true, rollNumber: true, className: true, section: true } },
      items: { include: { feeType: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(new ApiResponse(200, vouchers, 'Vouchers fetched successfully'));
});

export const deleteVoucher = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.feeVoucher.delete({ where: { id } });
  return res.status(200).json(new ApiResponse(200, null, 'Voucher deleted successfully'));
});

export const collectPayment = asyncHandler(async (req: Request, res: Response) => {
  const { voucherId, amount, paymentMethod, transactionId } = req.body;
  const userId = (req as any).user?.id;

  if (!voucherId || !amount || !paymentMethod) {
    throw new ApiError(400, 'Voucher ID, amount and payment method are required');
  }

  const voucher = await prisma.feeVoucher.findUnique({
    where: { id: voucherId },
    include: { student: true }
  });

  if (!voucher) throw new ApiError(404, 'Voucher not found');

  const newPaidAmount = voucher.paidAmount + parseFloat(amount);
  let status = 'PARTIAL';
  if (newPaidAmount >= voucher.totalAmount) status = 'PAID';

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.feePayment.create({
      data: {
        voucherId,
        studentId: voucher.studentId,
        amount: parseFloat(amount),
        paymentMethod,
        transactionId,
        receivedBy: userId || 1
      }
    });

    await tx.feeVoucher.update({
      where: { id: voucherId },
      data: {
        paidAmount: newPaidAmount,
        status
      }
    });

    return payment;
  });

  return res.status(201).json(new ApiResponse(201, result, 'Payment recorded successfully'));
});

export const exportVoucherReceiptPdf = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const voucher = await prisma.feeVoucher.findUnique({
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
    throw new ApiError(404, 'Voucher not found');
  }

  const schoolProfile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  
  const html = generateReceiptHtml(voucher, schoolProfile);
  const pdfBuffer = await generatePdfFromHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Receipt_${voucher.student.fullName.replace(/\s+/g, '_')}_${voucher.month}_${voucher.year}.pdf`);
  return res.send(pdfBuffer);
});

export const getFinanceStats = asyncHandler(async (req: Request, res: Response) => {
  const totalVouchers = await prisma.feeVoucher.count();
  const paidVouchers = await prisma.feeVoucher.count({ where: { status: 'PAID' } });
  
  const revenueResult = await prisma.feeVoucher.aggregate({
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

  return res.status(200).json(new ApiResponse(200, stats, 'Finance statistics fetched successfully'));
});
