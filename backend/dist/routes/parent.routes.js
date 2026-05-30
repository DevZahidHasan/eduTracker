"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parent_controller_1 = require("../controllers/parent.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require the user to be logged in and have the PARENT role
router.use(auth_middleware_1.authMiddleware);
router.use((0, auth_middleware_1.authorize)('PARENT'));
router.get('/dashboard', parent_controller_1.getParentDashboard);
router.get('/report/:studentId/:examType', parent_controller_1.getParentReportCard);
router.get('/results/:studentId', parent_controller_1.getParentResults);
exports.default = router;
