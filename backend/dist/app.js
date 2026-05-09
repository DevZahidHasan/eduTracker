"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)());
// Logging Middleware
app.use((0, morgan_1.default)('dev'));
// Core Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '16kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '16kb' }));
// Routes
app.use('/api', routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});
// Error Handling Middleware (must be after routes)
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
