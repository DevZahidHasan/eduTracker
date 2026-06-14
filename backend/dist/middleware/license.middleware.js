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
exports.licenseCheckMiddleware = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const license_util_1 = require("../utils/license.util");
const licenseCheckMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const licenseRecord = yield prisma_1.default.systemSetting.findUnique({
            where: { key: 'LICENSE_KEY' }
        });
        if (!licenseRecord || !licenseRecord.value) {
            return res.status(402).json({ error: 'LICENSE_MISSING', message: 'System not activated. Please provide a valid license key.' });
        }
        const decoded = (0, license_util_1.verifyLicenseToken)(licenseRecord.value);
        if (!decoded) {
            return res.status(402).json({ error: 'LICENSE_EXPIRED', message: 'License key is invalid or has expired.' });
        }
        // Pass the license info along in case a route needs it
        req.licenseInfo = decoded;
        next();
    }
    catch (error) {
        console.error('License verification error:', error);
        return res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to verify license status' });
    }
});
exports.licenseCheckMiddleware = licenseCheckMiddleware;
