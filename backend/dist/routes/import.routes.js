"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const import_controller_1 = require("../controllers/import.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Only Admins can import data
router.post('/students', (0, auth_middleware_1.authorize)('ADMIN'), upload_middleware_1.upload.single('file'), import_controller_1.importStudents);
router.post('/staff', (0, auth_middleware_1.authorize)('ADMIN'), upload_middleware_1.upload.single('file'), import_controller_1.importStaff);
router.post('/books', (0, auth_middleware_1.authorize)('ADMIN'), upload_middleware_1.upload.single('file'), import_controller_1.importBooks);
// Templates are accessible to Admins
router.get('/template/:type', (0, auth_middleware_1.authorize)('ADMIN'), import_controller_1.getTemplates);
exports.default = router;
