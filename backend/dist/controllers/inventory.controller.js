"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssetMaintenance = exports.createAssetMaintenance = exports.getAssetMaintenance = exports.deleteAsset = exports.updateAsset = exports.createAsset = exports.getAssetById = exports.getAssets = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
// --- Asset Management ---
exports.getAssets = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assets = yield prisma_1.default.asset.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, assets, 'Assets fetched successfully'));
}));
exports.getAssetById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const asset = yield prisma_1.default.asset.findUnique({
        where: { id: parseInt(id) },
        include: { maintenanceLogs: { orderBy: { date: 'desc' } } }
    });
    if (!asset) {
        throw new apiError_1.ApiError(404, 'Asset not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, asset, 'Asset fetched successfully'));
}));
exports.createAsset = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, purchaseDate, purchaseCost, condition, location, serialNumber, warrantyExpiry, nextMaintenanceDate, notes } = req.body;
    // Generate unique assetId if not provided
    let { assetId } = req.body;
    if (!assetId) {
        const count = yield prisma_1.default.asset.count();
        assetId = `AST-${(count + 1).toString().padStart(4, '0')}`;
    }
    const asset = yield prisma_1.default.asset.create({
        data: {
            assetId,
            name,
            category,
            purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
            purchaseCost: parseFloat(purchaseCost) || 0,
            condition,
            location,
            serialNumber,
            warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
            nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
            notes,
        },
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, asset, 'Asset created successfully'));
}));
exports.updateAsset = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, category, purchaseDate, purchaseCost, condition, location, status, serialNumber, warrantyExpiry, nextMaintenanceDate, notes } = req.body;
    const asset = yield prisma_1.default.asset.update({
        where: { id: parseInt(id) },
        data: {
            name,
            category,
            purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
            purchaseCost: purchaseCost !== undefined ? parseFloat(purchaseCost) : undefined,
            condition,
            location,
            status,
            serialNumber,
            warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
            nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : undefined,
            notes,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, asset, 'Asset updated successfully'));
}));
exports.deleteAsset = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.asset.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Asset deleted successfully'));
}));
// --- Asset Maintenance ---
exports.getAssetMaintenance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId } = req.params;
    const maintenance = yield prisma_1.default.assetMaintenance.findMany({
        where: { assetId: parseInt(assetId) },
        orderBy: { date: 'desc' },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, maintenance, 'Maintenance logs fetched successfully'));
}));
exports.createAssetMaintenance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetId, date, description, cost, performedBy, nextMaintenanceDate } = req.body;
    const maintenance = yield prisma_1.default.assetMaintenance.create({
        data: {
            assetId: parseInt(assetId),
            date: date ? new Date(date) : new Date(),
            description,
            cost: parseFloat(cost) || 0,
            performedBy,
        },
    });
    // Update next maintenance date on Asset if provided
    if (nextMaintenanceDate) {
        yield prisma_1.default.asset.update({
            where: { id: parseInt(assetId) },
            data: { nextMaintenanceDate: new Date(nextMaintenanceDate) }
        });
    }
    res.status(201).json(new apiResponse_1.ApiResponse(201, maintenance, 'Maintenance log created successfully'));
}));
exports.deleteAssetMaintenance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.assetMaintenance.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Maintenance log deleted successfully'));
}));
