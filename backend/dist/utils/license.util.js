"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLicenseToken = exports.verifyLicenseToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const LICENSE_SECRET = process.env.LICENSE_SECRET || 'edu-tracker-master-license-secret-key-2026';
const verifyLicenseToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, LICENSE_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyLicenseToken = verifyLicenseToken;
const generateLicenseToken = (payload) => {
    const expiresInSeconds = payload.expiresInDays * 24 * 60 * 60;
    return jsonwebtoken_1.default.sign({
        clientName: payload.clientName,
        type: payload.type,
    }, LICENSE_SECRET, { expiresIn: expiresInSeconds });
};
exports.generateLicenseToken = generateLicenseToken;
