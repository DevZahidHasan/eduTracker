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
exports.getMe = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    // Save refresh token to database
    yield prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });
    return { accessToken, refreshToken };
});
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
    // Check if the user is allowed to login
    if (!user.canLogin) {
        throw new apiError_1.ApiError(403, 'Your account does not have login access');
    }
    // Ensure password exists (it should if canLogin is true, but for TS safety)
    if (!user.password) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    }
    const { accessToken, refreshToken } = yield generateTokens(user);
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const responseData = {
        token: accessToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profileImage: user.profileImage
        }
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, responseData, 'Login successful'));
}));
exports.refresh = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new apiError_1.ApiError(401, 'Refresh token required');
    }
    const storedToken = yield prisma_1.default.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
        if (storedToken) {
            yield prisma_1.default.refreshToken.delete({ where: { id: storedToken.id } });
        }
        throw new apiError_1.ApiError(401, 'Invalid or expired refresh token');
    }
    try {
        jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({ id: storedToken.user.id, email: storedToken.user.email, role: storedToken.user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        // Optional: Rotate refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: storedToken.user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        yield prisma_1.default.$transaction([
            prisma_1.default.refreshToken.delete({ where: { id: storedToken.id } }),
            prisma_1.default.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: storedToken.user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            }),
        ]);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json(new apiResponse_1.ApiResponse(200, { token: accessToken }, 'Token refreshed successfully'));
    }
    catch (error) {
        if (storedToken) {
            yield prisma_1.default.refreshToken.delete({ where: { id: storedToken.id } });
        }
        throw new apiError_1.ApiError(401, 'Invalid refresh token');
    }
}));
exports.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        yield prisma_1.default.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    }
    res.clearCookie('refreshToken');
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Logged out successfully'));
}));
exports.getMe = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { user }, 'User profile fetched successfully'));
}));
