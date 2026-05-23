"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("../controllers/document.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Template Routes
router.get('/templates', document_controller_1.getTemplates);
router.post('/templates', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), document_controller_1.createTemplate);
router.put('/templates/:id', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), document_controller_1.updateTemplate);
router.delete('/templates/:id', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), document_controller_1.deleteTemplate);
// Generation Routes
router.post('/generate/id-cards', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'ACCOUNTANT'), document_controller_1.generateIDCards);
router.post('/generate/certificate', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'), document_controller_1.generateCertificate);
exports.default = router;
