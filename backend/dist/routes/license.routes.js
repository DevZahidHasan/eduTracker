"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const license_controller_1 = require("../controllers/license.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Allow checking status and updating without full license, but updating requires admin auth
router.get('/status', license_controller_1.getLicenseStatus);
router.post('/update', auth_middleware_1.authMiddleware, license_controller_1.updateLicense);
exports.default = router;
