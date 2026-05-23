import { Router } from 'express';
import * as financeController from '../controllers/finance.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// --- Fee Types & Structures (Admin Only) ---
router.get('/fee-types', financeController.getFeeTypes);
router.post('/fee-types', authorize('ADMIN'), financeController.createFeeType);
router.put('/fee-types/:id', authorize('ADMIN'), financeController.updateFeeType);
router.delete('/fee-types/:id', authorize('ADMIN'), financeController.deleteFeeType);

router.get('/fee-structures', financeController.getFeeStructures);
router.post('/fee-structures', authorize('ADMIN'), financeController.upsertFeeStructure);

// --- Voucher Automation (Admin & Accountant) ---
router.get('/vouchers', authorize('ADMIN', 'ACCOUNTANT'), financeController.getVouchers);
router.delete('/vouchers/:id', authorize('ADMIN', 'ACCOUNTANT'), financeController.deleteVoucher);
router.post('/vouchers/generate', authorize('ADMIN', 'ACCOUNTANT'), financeController.generateMonthlyVouchers);
router.get('/vouchers/student/:studentId', financeController.getStudentVouchers);

// --- Payments ---
router.post('/payments/collect', authorize('ADMIN', 'ACCOUNTANT'), financeController.collectPayment);
router.get('/export-receipt/:id', authorize('ADMIN', 'ACCOUNTANT'), financeController.exportVoucherReceiptPdf);

// --- Dashboard Stats ---
router.get('/stats', authorize('ADMIN', 'ACCOUNTANT'), financeController.getFinanceStats);

export default router;
