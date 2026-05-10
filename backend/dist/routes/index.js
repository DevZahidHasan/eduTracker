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
exports.default = router;
