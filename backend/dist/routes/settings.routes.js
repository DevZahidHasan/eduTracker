"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/profile', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), settings_controller_1.getSchoolProfile);
router.post('/profile', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.updateSchoolProfile);
router.post('/profile/logo', (0, auth_middleware_1.authorize)('ADMIN'), upload_middleware_1.upload.single('logo'), settings_controller_1.uploadLogo);
router.get('/system', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.getSystemSettings);
router.post('/system', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.updateSystemSettings);
router.get('/users', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.getUsers);
router.put('/users/:id', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.updateUser);
router.delete('/users/:id', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.deleteUser);
// Grade Scale
router.get('/grade-scale', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'TEACHER'), settings_controller_1.getGradeScales);
router.post('/grade-scale', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.createGradeScale);
router.put('/grade-scale/:id', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.updateGradeScale);
router.delete('/grade-scale/:id', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.deleteGradeScale);
router.post('/end-of-day', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.triggerEndOfDay);
// Backup Management
router.post('/backup', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.triggerBackup);
router.get('/backups', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.getBackups);
router.get('/backups/download/:filename', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.downloadBackup);
router.delete('/backups/:filename', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.deleteBackup);
// WhatsApp Testing
router.post('/whatsapp-test', (0, auth_middleware_1.authorize)('ADMIN'), settings_controller_1.sendTestWhatsApp);
exports.default = router;
