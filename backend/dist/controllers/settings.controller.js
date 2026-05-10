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
exports.deleteUser = exports.updateUser = exports.getUsers = exports.updateSystemSettings = exports.getSystemSettings = exports.updateSchoolProfile = exports.triggerEndOfDay = exports.getSchoolProfile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = __importDefault(require("../prisma"));
const cron_service_1 = require("../services/cron.service");
exports.getSchoolProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let profile = yield prisma_1.default.schoolProfile.findUnique({ where: { id: 1 } });
    if (!profile) {
        profile = yield prisma_1.default.schoolProfile.create({ data: {} });
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'School profile fetched successfully'));
}));
exports.triggerEndOfDay = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, cron_service_1.runEndOfDayTasks)();
    if (result.status === 'skipped') {
        return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'End of day tasks already ran for today.'));
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'End of day tasks triggered successfully.'));
}));
exports.updateSchoolProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, email, academicYear, logo } = req.body;
    const profile = yield prisma_1.default.schoolProfile.upsert({
        where: { id: 1 },
        update: { name, address, phone, email, academicYear, logo },
        create: { name, address, phone, email, academicYear, logo },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'School profile updated successfully'));
}));
exports.getSystemSettings = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield prisma_1.default.systemSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
    return res.status(200).json(new apiResponse_1.ApiResponse(200, settingsMap, 'System settings fetched successfully'));
}));
exports.updateSystemSettings = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { settings } = req.body;
    if (settings && typeof settings === 'object') {
        const transaction = Object.entries(settings).map(([key, value]) => prisma_1.default.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        }));
        yield prisma_1.default.$transaction(transaction);
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'System settings updated successfully'));
}));
exports.getUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, users, 'Users fetched successfully'));
}));
exports.updateUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = yield prisma_1.default.user.update({
        where: { id: Number(id) },
        data: { name, email, role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, user, 'User updated successfully'));
}));
exports.deleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Prevent deleting the last admin or yourself if we had auth info here
    // For now, just a simple delete
    yield prisma_1.default.user.delete({
        where: { id: Number(id) }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'User deleted successfully'));
}));
