"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const config_routes_1 = __importDefault(require("./config.routes"));
const students_routes_1 = __importDefault(require("./students.routes"));
const marks_routes_1 = __importDefault(require("./marks.routes"));
const attendance_routes_1 = __importDefault(require("./attendance.routes"));
const aiInsights_routes_1 = __importDefault(require("./aiInsights.routes"));
const classes_routes_1 = __importDefault(require("./classes.routes"));
const reports_routes_1 = __importDefault(require("./reports.routes"));
const settings_routes_1 = __importDefault(require("./settings.routes"));
const audit_routes_1 = __importDefault(require("./audit.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const notifications_routes_1 = __importDefault(require("./notifications.routes"));
const questionPapers_routes_1 = __importDefault(require("./questionPapers.routes"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.use('/auth', auth_routes_1.default);
// Protected routes (require valid JWT)
router.use('/config', auth_middleware_1.authMiddleware, config_routes_1.default);
router.use('/students', auth_middleware_1.authMiddleware, students_routes_1.default);
router.use('/marks', auth_middleware_1.authMiddleware, marks_routes_1.default);
router.use('/attendance', auth_middleware_1.authMiddleware, attendance_routes_1.default);
router.use('/ai-insights', auth_middleware_1.authMiddleware, aiInsights_routes_1.default);
router.use('/classes', auth_middleware_1.authMiddleware, classes_routes_1.default);
router.use('/reports', auth_middleware_1.authMiddleware, reports_routes_1.default);
router.use('/settings', auth_middleware_1.authMiddleware, settings_routes_1.default);
router.use('/audit', auth_middleware_1.authMiddleware, audit_routes_1.default);
router.use('/users', auth_middleware_1.authMiddleware, users_routes_1.default);
router.use('/notifications', auth_middleware_1.authMiddleware, notifications_routes_1.default);
router.use('/question-papers', auth_middleware_1.authMiddleware, questionPapers_routes_1.default);
exports.default = router;
