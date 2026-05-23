"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hr_controller_1 = require("../controllers/hr.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// --- STAFF & SALARY ---
router.get('/staff', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT', 'PRINCIPAL'), hr_controller_1.getStaffMembers);
router.put('/staff/:userId/salary', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT'), hr_controller_1.updateStaffSalary);
// --- ATTENDANCE ---
router.post('/attendance', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'STAFF'), hr_controller_1.markStaffAttendance);
router.get('/attendance', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'STAFF'), hr_controller_1.getStaffAttendance);
// --- LEAVE REQUESTS ---
router.post('/leaves', hr_controller_1.applyForLeave); // Any staff can apply
router.get('/leaves', hr_controller_1.getLeaveRequests); // View leaves (logic limits to own if not admin)
router.put('/leaves/:id/status', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), hr_controller_1.updateLeaveStatus);
// --- PAYROLL ---
router.post('/payroll/generate', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT'), hr_controller_1.generatePayroll);
router.get('/payroll', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT'), hr_controller_1.getPayrollRecords);
router.put('/payroll/:id/pay', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT'), hr_controller_1.paySalary);
router.get('/payroll/:id/download', (0, auth_middleware_1.authorize)('ADMIN', 'ACCOUNTANT'), hr_controller_1.downloadSalarySlip);
exports.default = router;
