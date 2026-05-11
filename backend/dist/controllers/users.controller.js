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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Get all users (staff)
 */
exports.getUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            nid: true,
            phone: true,
            address: true,
            canLogin: true,
            profileImage: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, users, 'Users fetched successfully'));
}));
/**
 * Create a new user (staff)
 */
exports.createUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role, nid, phone, address, canLogin, profileImage } = req.body;
    if (!email || !role) {
        throw new apiError_1.ApiError(400, 'Email and role are required');
    }
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new apiError_1.ApiError(400, 'User with this email already exists');
    }
    let hashedPassword = null;
    if (canLogin && password) {
        hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    }
    const user = yield prisma_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
            nid,
            phone,
            address,
            canLogin: !!canLogin,
            profileImage,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            nid: true,
            phone: true,
            address: true,
            canLogin: true,
            profileImage: true,
            createdAt: true,
        },
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, user, 'User created successfully'));
}));
/**
 * Update a user (staff)
 */
exports.updateUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, name, role, password, nid, phone, address, canLogin, profileImage } = req.body;
    const userData = {
        email,
        name,
        role,
        nid,
        phone,
        address,
        canLogin: !!canLogin,
        profileImage,
    };
    if (password && canLogin) {
        userData.password = yield bcryptjs_1.default.hash(password, 10);
    }
    else if (!canLogin) {
        userData.password = null;
    }
    const user = yield prisma_1.default.user.update({
        where: { id: parseInt(id) },
        data: userData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            nid: true,
            phone: true,
            address: true,
            canLogin: true,
            profileImage: true,
            createdAt: true,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, user, 'User updated successfully'));
}));
/**
 * Delete a user (staff)
 */
exports.deleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // Prevent self-deletion
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === parseInt(id)) {
        throw new apiError_1.ApiError(400, 'You cannot delete your own account');
    }
    yield prisma_1.default.user.delete({
        where: { id: parseInt(id) },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'User deleted successfully'));
}));
