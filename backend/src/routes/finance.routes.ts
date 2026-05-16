import { Router } from 'express';
import * as financeController from '../controllers/finance.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// --- Fee Types & Structures (Admin Only) ---
router.get('/fee-types', financeController.getFeeTypes);
router.post('/fee-types', authorize(Role.ADMIN), financeController.createFeeType);
router.put('/fee-types/:id', authorize(Role.ADMIN), financeController.updateFeeType);
router.delete('/fee-types/:id', authorize(Role.ADMIN), financeController.deleteFeeType);

router.get('/fee-structures', financeController.getFeeStructures);
router.post('/fee-structures', authorize(Role.ADMIN), financeController.upsertFeeStructure);

// --- Voucher Automation (Admin & Accountant) ---
router.get('/vouchers', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.getVouchers);
router.delete('/vouchers/:id', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.deleteVoucher);
router.post('/vouchers/generate', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.generateMonthlyVouchers);
router.get('/vouchers/student/:studentId', financeController.getStudentVouchers);

// --- Payments ---
router.post('/payments/collect', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.collectPayment);
router.get('/export-receipt/:id', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.exportVoucherReceiptPdf);

// --- Dashboard Stats ---
router.get('/stats', authorize(Role.ADMIN, Role.ACCOUNTANT as any), financeController.getFinanceStats);

export default router;
