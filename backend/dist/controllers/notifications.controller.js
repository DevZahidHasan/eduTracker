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
exports.createNotification = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = __importDefault(require("../prisma"));
/**
 * Get all notifications for the current user
 */
exports.getNotifications = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notifications = yield prisma_1.default.notification.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 50, // Limit to 50 most recent
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, notifications, 'Notifications fetched successfully'));
}));
/**
 * Mark a notification as read
 */
exports.markAsRead = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    yield prisma_1.default.notification.update({
        where: {
            id: parseInt(id),
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, // Security: ensure it belongs to the user
        },
        data: {
            isRead: true,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Notification marked as read'));
}));
/**
 * Mark all notifications as read for the current user
 */
exports.markAllAsRead = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield prisma_1.default.notification.updateMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'All notifications marked as read'));
}));
/**
 * Delete a notification
 */
exports.deleteNotification = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    yield prisma_1.default.notification.delete({
        where: {
            id: parseInt(id),
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Notification deleted'));
}));
/**
 * Helper function to create notifications (internal use)
 */
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.notification.create({
        data,
    });
});
exports.createNotification = createNotification;
