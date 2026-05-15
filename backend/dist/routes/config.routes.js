"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_controller_1 = require("../controllers/config.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', config_controller_1.getConfig);
// Protected administration routes
router.use(auth_middleware_1.authMiddleware);
router.post('/classes', config_controller_1.createClass);
router.post('/sections', config_controller_1.createSection);
router.post('/subjects', config_controller_1.createSubject);
router.post('/exam-types', config_controller_1.createExamType);
router.patch('/exam-types/:name', config_controller_1.updateExamType);
exports.default = router;
