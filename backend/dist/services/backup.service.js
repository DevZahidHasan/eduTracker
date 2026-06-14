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
exports.performDatabaseBackup = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const prisma_1 = __importDefault(require("../prisma"));
const googleDrive_service_1 = require("./googleDrive.service");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
const performDatabaseBackup = (customPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL not found in environment variables');
        }
        // Get backup path from settings if not provided
        let backupDir = customPath;
        if (!backupDir) {
            const pathSetting = yield prisma_1.default.systemSetting.findUnique({
                where: { key: 'backupPath' }
            });
            backupDir = (pathSetting === null || pathSetting === void 0 ? void 0 : pathSetting.value) || path_1.default.join(process.cwd(), 'backups');
        }
        // Ensure directory exists
        if (!fs_1.default.existsSync(backupDir)) {
            fs_1.default.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `edutracker_backup_${timestamp}.sql`;
        const fullPath = path_1.default.join(backupDir, filename);
        // Extract connection details from URL
        // Format: postgresql://USER:PASSWORD@HOST:PORT/DBNAME
        const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
        const match = dbUrl.match(regex);
        if (!match) {
            throw new Error('Could not parse DATABASE_URL');
        }
        const [_, user, password, host, port, dbname] = match;
        // Try to find pg_dump path from settings, fallback to common Windows path, then just 'pg_dump'
        const pgDumpPathSetting = yield prisma_1.default.systemSetting.findUnique({ where: { key: 'pgDumpPath' } });
        const pgDumpBin = (pgDumpPathSetting === null || pgDumpPathSetting === void 0 ? void 0 : pgDumpPathSetting.value) || 'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';
        // Use PGPASSWORD environment variable to avoid interactive prompt
        const command = `"${pgDumpBin}" -h ${host} -p ${port} -U ${user} -d ${dbname} -F p -f "${fullPath}"`;
        try {
            yield execPromise(command, {
                env: Object.assign(Object.assign({}, process.env), { PGPASSWORD: password })
            });
        }
        catch (execError) {
            console.error('pg_dump execution failed:', execError.message);
            // If the hardcoded path failed, try the simple command as a last resort
            if (pgDumpBin !== 'pg_dump') {
                const fallbackCommand = `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbname} -F p -f "${fullPath}"`;
                try {
                    yield execPromise(fallbackCommand, { env: Object.assign(Object.assign({}, process.env), { PGPASSWORD: password }) });
                }
                catch (fallbackError) {
                    throw new Error(`Backup utility (pg_dump) not found. Checked: ${pgDumpBin} and system path. Please ensure PostgreSQL Command Line Tools are installed.`);
                }
            }
            else {
                throw execError;
            }
        }
        // Log in system settings
        yield prisma_1.default.systemSetting.upsert({
            where: { key: 'lastBackupRun' },
            update: { value: new Date().toISOString() },
            create: { key: 'lastBackupRun', value: new Date().toISOString() }
        });
        // --- OPTIONAL: Cloud Sync (Wrapped in try-catch to be non-blocking) ---
        let cloudSynced = false;
        try {
            const cloudFileId = yield (0, googleDrive_service_1.uploadToGoogleDrive)(filename, fullPath);
            cloudSynced = !!cloudFileId;
        }
        catch (err) {
            console.error('Non-blocking cloud sync failure:', err);
        }
        return {
            success: true,
            filename,
            path: fullPath,
            timestamp: new Date().toISOString(),
            cloudSynced
        };
    }
    catch (error) {
        console.error('Backup failed:', error);
        throw error;
    }
});
exports.performDatabaseBackup = performDatabaseBackup;
