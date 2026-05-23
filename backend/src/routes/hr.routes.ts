import { Router } from 'express';
import {
  getStaffMembers,
  updateStaffSalary,
  markStaffAttendance,
  getStaffAttendance,
  applyForLeave,
  getLeaveRequests,
  updateLeaveStatus,
  generatePayroll,
  getPayrollRecords,
  paySalary,
  downloadSalarySlip
} from '../controllers/hr.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// --- STAFF & SALARY ---
router.get('/staff', authorize('ADMIN', 'ACCOUNTANT', 'PRINCIPAL'), getStaffMembers);
router.put('/staff/:userId/salary', authorize('ADMIN', 'ACCOUNTANT'), updateStaffSalary);

// --- ATTENDANCE ---
router.post('/attendance', authorize('ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'STAFF'), markStaffAttendance);
router.get('/attendance', authorize('ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'STAFF'), getStaffAttendance);

// --- LEAVE REQUESTS ---
router.post('/leaves', applyForLeave); // Any staff can apply
router.get('/leaves', getLeaveRequests); // View leaves (logic limits to own if not admin)
router.put('/leaves/:id/status', authorize('ADMIN', 'PRINCIPAL'), updateLeaveStatus);

// --- PAYROLL ---
router.post('/payroll/generate', authorize('ADMIN', 'ACCOUNTANT'), generatePayroll);
router.get('/payroll', authorize('ADMIN', 'ACCOUNTANT'), getPayrollRecords);
router.put('/payroll/:id/pay', authorize('ADMIN', 'ACCOUNTANT'), paySalary);
router.get('/payroll/:id/download', authorize('ADMIN', 'ACCOUNTANT'), downloadSalarySlip);

export default router;
