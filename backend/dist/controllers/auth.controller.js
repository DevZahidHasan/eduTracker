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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
exports.register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
        throw new apiError_1.ApiError(400, 'Email, password and name are required');
    }
    const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new apiError_1.ApiError(400, 'User already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: role || 'TEACHER',
        },
    });
    const userData = { id: user.id, email: user.email, role: user.role };
    return res.status(201).json(new apiResponse_1.ApiResponse(201, userData, 'User created successfully'));
}));
exports.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError_1.ApiError(400, 'Email and password are required');
    }
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
    });
    const responseData = {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, responseData, 'Login successful'));
}));
