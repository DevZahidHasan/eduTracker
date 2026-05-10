"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * General API rate limiter
 * Limits each IP to a configurable number of requests per window
 */
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // Default: 15 minutes
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Default: 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again later',
    },
});
/**
 * Stricter rate limiter for auth routes
 * Limits each IP to a configurable number of login/register attempts per window
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.AUTH_LIMIT_WINDOW_MS || '900000'), // Default: 15 minutes
    limit: parseInt(process.env.AUTH_LIMIT_MAX || '5'), // Default: 5 attempts per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
});
