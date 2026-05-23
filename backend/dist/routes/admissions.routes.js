"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admissions_controller_1 = require("../controllers/admissions.controller");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// Routes for handling inquiries
router
    .route('/inquiries')
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), admissions_controller_1.createInquiry)
    .get((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK', 'ACCOUNTANT'), admissions_controller_1.getInquiries);
router
    .route('/inquiries/:id')
    .get((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK', 'ACCOUNTANT'), admissions_controller_1.getInquiryById)
    .put((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), admissions_controller_1.updateInquiry)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), admissions_controller_1.deleteInquiry);
// Route for converting an inquiry to an admitted student
router.post('/inquiries/:id/admit', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), admissions_controller_1.admitInquiry);
exports.default = router;
