"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protect all routes
router.use(auth_middleware_1.authMiddleware);
// Asset Routes
router.get('/', inventory_controller_1.getAssets);
router.get('/:id', inventory_controller_1.getAssetById);
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), inventory_controller_1.createAsset);
router.patch('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), inventory_controller_1.updateAsset);
router.delete('/:id', (0, auth_middleware_1.authorize)('ADMIN'), inventory_controller_1.deleteAsset);
// Maintenance Routes
router.get('/:assetId/maintenance', inventory_controller_1.getAssetMaintenance);
router.post('/maintenance', (0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'STAFF', 'ACCOUNTANT'), inventory_controller_1.createAssetMaintenance);
router.delete('/maintenance/:id', (0, auth_middleware_1.authorize)('ADMIN'), inventory_controller_1.deleteAssetMaintenance);
exports.default = router;
