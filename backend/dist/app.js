"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// import { apiLimiter } from './middleware/rateLimit.middleware';
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// Security Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "*"], // Allow connecting to any API during development/local deploy
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Fixes logo display across ports
    xssFilter: true, // X-XSS-Protection
    frameguard: {
        action: 'deny', // X-Frame-Options: DENY
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true, // X-Content-Type-Options: nosniff
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
}));
// Logging Middleware
app.use((0, morgan_1.default)('dev'));
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:6001'
].filter(Boolean);
// Core Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Apply global rate limiter to all API routes
// app.use('/api', apiLimiter);
// Routes
app.use('/api', routes_1.default);
// Health check & Version
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running', version: '1.0.0' });
});
app.get('/api/version', (req, res) => {
    res.status(200).json({ version: '1.0.0', buildDate: new Date().toISOString() });
});
// Error Handling Middleware (must be after routes)
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
