"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("../controllers/audit.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Only Admins should be able to see audit logs
router.get('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)('ADMIN'), audit_controller_1.getAuditLogs);
exports.default = router;
