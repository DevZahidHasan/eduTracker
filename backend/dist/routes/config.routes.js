"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_controller_1 = require("../controllers/config.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    next();
}, config_controller_1.getConfig);
// Protected administration routes
router.use(auth_middleware_1.authMiddleware);
router.post('/classes', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.createClass);
router.delete('/classes/:name', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.deleteClass);
router.post('/sections', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.createSection);
router.delete('/sections/:className/:section', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.deleteSection);
router.post('/subjects', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.createSubject);
router.delete('/subjects/:name', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.deleteSubject);
router.post('/exam-types', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.createExamType);
router.patch('/exam-types/:name', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.updateExamType);
router.delete('/exam-types/:name', (0, auth_middleware_1.authorize)('ADMIN'), config_controller_1.deleteExamType);
exports.default = router;
