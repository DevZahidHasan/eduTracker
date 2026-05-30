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
exports.updateLicense = exports.getLicenseStatus = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const license_util_1 = require("../utils/license.util");
const getLicenseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const licenseRecord = yield prisma_1.default.systemSetting.findUnique({
            where: { key: 'LICENSE_KEY' }
        });
        if (!licenseRecord || !licenseRecord.value) {
            return res.status(200).json({ status: 'MISSING', message: 'No license key configured.' });
        }
        const decoded = (0, license_util_1.verifyLicenseToken)(licenseRecord.value);
        if (!decoded) {
            return res.status(200).json({ status: 'EXPIRED', message: 'License has expired or is invalid.' });
        }
        // Convert exp to ISO string
        const expiryDate = new Date(decoded.exp * 1000).toISOString();
        return res.status(200).json({
            status: 'VALID',
            clientName: decoded.clientName,
            type: decoded.type,
            expiryDate,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to check license status' });
    }
});
exports.getLicenseStatus = getLicenseStatus;
const updateLicense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { licenseKey } = req.body;
        if (!licenseKey) {
            return res.status(400).json({ error: 'BAD_REQUEST', message: 'License key is required.' });
        }
        const decoded = (0, license_util_1.verifyLicenseToken)(licenseKey);
        if (!decoded) {
            return res.status(400).json({ error: 'INVALID_LICENSE', message: 'The provided license key is invalid or expired.' });
        }
        // Upsert the setting
        yield prisma_1.default.systemSetting.upsert({
            where: { key: 'LICENSE_KEY' },
            update: { value: licenseKey },
            create: { key: 'LICENSE_KEY', value: licenseKey },
        });
        return res.status(200).json({ message: 'License key verified and saved successfully.' });
    }
    catch (error) {
        return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update license key' });
    }
});
exports.updateLicense = updateLicense;
