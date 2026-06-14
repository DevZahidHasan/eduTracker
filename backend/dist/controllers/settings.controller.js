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
exports.sendTestWhatsApp = exports.deleteBackup = exports.downloadBackup = exports.getBackups = exports.deleteGradeScale = exports.updateGradeScale = exports.createGradeScale = exports.getGradeScales = exports.triggerBackup = exports.deleteUser = exports.updateUser = exports.getUsers = exports.updateSystemSettings = exports.getSystemSettings = exports.triggerEndOfDay = exports.uploadLogo = exports.updateSchoolProfile = exports.getSchoolProfile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = __importDefault(require("../prisma"));
const cron_service_1 = require("../services/cron.service");
const backup_service_1 = require("../services/backup.service");
const whatsapp_service_1 = require("../services/whatsapp.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.getSchoolProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let profile = yield prisma_1.default.schoolProfile.findUnique({ where: { id: 1 } });
    if (!profile) {
        profile = yield prisma_1.default.schoolProfile.create({ data: {} });
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'School profile fetched successfully'));
}));
exports.updateSchoolProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, email, academicYear, logo, website } = req.body;
    const profile = yield prisma_1.default.schoolProfile.upsert({
        where: { id: 1 },
        update: { name, address, phone, email, academicYear, logo, website },
        create: { name, address, phone, email, academicYear, logo, website },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'School profile updated successfully'));
}));
exports.uploadLogo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new apiError_1.ApiError(400, 'No file uploaded');
    }
    // Construct the logo URL
    const protocol = req.protocol;
    const host = req.get('host');
    const logoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { logoUrl }, 'Logo uploaded successfully'));
}));
exports.triggerEndOfDay = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, cron_service_1.runEndOfDayTasks)();
    if (result.status === 'skipped') {
        return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'End of day tasks already ran for today.'));
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'End of day tasks triggered successfully.'));
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
    yield prisma_1.default.user.delete({
        where: { id: Number(id) }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'User deleted successfully'));
}));
exports.triggerBackup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, backup_service_1.performDatabaseBackup)();
        // Check if cloud sync was attempted and if it failed
        const cloudEnabled = yield prisma_1.default.systemSetting.findUnique({ where: { key: 'googleDriveEnabled' } });
        const lastCloud = yield prisma_1.default.systemSetting.findUnique({ where: { key: 'lastCloudBackupRun' } });
        return res.status(200).json(new apiResponse_1.ApiResponse(200, Object.assign(Object.assign({}, result), { cloudSyncMessage: (cloudEnabled === null || cloudEnabled === void 0 ? void 0 : cloudEnabled.value) === 'true' && !result.cloudSynced
                ? 'Local backup OK, but Cloud Sync failed. Check your Folder ID and Permissions.'
                : 'Backup completed successfully.' }), 'Backup triggered successfully'));
    }
    catch (error) {
        return res.status(500).json(new apiResponse_1.ApiResponse(500, null, error.message || 'Failed to trigger backup'));
    }
}));
// --- Grade Scale ---
exports.getGradeScales = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scales = yield prisma_1.default.gradeScale.findMany({
        orderBy: { minScore: 'desc' }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, scales, 'Grade scales fetched successfully'));
}));
exports.createGradeScale = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { grade, minScore, maxScore, points } = req.body;
    const scale = yield prisma_1.default.gradeScale.create({
        data: {
            grade,
            minScore: parseFloat(minScore),
            maxScore: parseFloat(maxScore),
            points: parseFloat(points)
        }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, scale, 'Grade scale created successfully'));
}));
exports.updateGradeScale = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { grade, minScore, maxScore, points } = req.body;
    const scale = yield prisma_1.default.gradeScale.update({
        where: { id: Number(id) },
        data: {
            grade,
            minScore: parseFloat(minScore),
            maxScore: parseFloat(maxScore),
            points: parseFloat(points)
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, scale, 'Grade scale updated successfully'));
}));
exports.deleteGradeScale = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.gradeScale.delete({ where: { id: Number(id) } });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Grade scale deleted successfully'));
}));
// --- Backup Management ---
const getBackupDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    const pathSetting = yield prisma_1.default.systemSetting.findUnique({
        where: { key: 'backupPath' }
    });
    return (pathSetting === null || pathSetting === void 0 ? void 0 : pathSetting.value) || path_1.default.join(process.cwd(), 'backups');
});
exports.getBackups = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const backupDir = yield getBackupDirectory();
    if (!fs_1.default.existsSync(backupDir)) {
        return res.status(200).json(new apiResponse_1.ApiResponse(200, [], 'Backups directory not found'));
    }
    const files = fs_1.default.readdirSync(backupDir);
    const backups = files
        .filter(f => f.endsWith('.sql'))
        .map(file => {
        const stats = fs_1.default.statSync(path_1.default.join(backupDir, file));
        return {
            filename: file,
            size: stats.size,
            createdAt: stats.birthtime,
        };
    })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return res.status(200).json(new apiResponse_1.ApiResponse(200, backups, 'Backups fetched successfully'));
}));
exports.downloadBackup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    const backupDir = yield getBackupDirectory();
    const filePath = path_1.default.join(backupDir, filename);
    // Security check to prevent path traversal
    if (!filePath.startsWith(backupDir) || !fs_1.default.existsSync(filePath)) {
        throw new apiError_1.ApiError(404, 'Backup file not found');
    }
    res.download(filePath);
}));
exports.deleteBackup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    const backupDir = yield getBackupDirectory();
    const filePath = path_1.default.join(backupDir, filename);
    // Security check to prevent path traversal
    if (!filePath.startsWith(backupDir) || !fs_1.default.existsSync(filePath)) {
        throw new apiError_1.ApiError(404, 'Backup file not found');
    }
    fs_1.default.unlinkSync(filePath);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Backup deleted successfully'));
}));
exports.sendTestWhatsApp = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    if (!phone)
        throw new apiError_1.ApiError(400, 'Phone number is required');
    const success = yield (0, whatsapp_service_1.sendWhatsAppMessage)(phone, 'EduTrack Academy: This is a test message from your system configuration.');
    if (success) {
        return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Test message sent successfully'));
    }
    else {
        throw new apiError_1.ApiError(500, 'Failed to send test message. Check your Twilio settings.');
    }
}));
