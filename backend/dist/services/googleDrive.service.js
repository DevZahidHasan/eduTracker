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
exports.uploadToGoogleDrive = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../prisma"));
/**
 * Service to handle uploading files to Google Drive using a Service Account
 */
const uploadToGoogleDrive = (fileName, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1. Get Google Drive settings from database
        const settings = yield prisma_1.default.systemSetting.findMany({
            where: {
                key: { in: ['googleDriveEnabled', 'googleDriveFolderId', 'googleDriveCredentials'] }
            }
        });
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        // CRITICAL: Exit immediately if not explicitly enabled
        if (settingsMap['googleDriveEnabled'] !== 'true') {
            return null;
        }
        const folderId = (_a = settingsMap['googleDriveFolderId']) === null || _a === void 0 ? void 0 : _a.trim();
        const credentialsJson = settingsMap['googleDriveCredentials'];
        console.log(`[CloudSync] Debug: FolderID="${folderId}", Enabled="${settingsMap['googleDriveEnabled']}"`);
        if (!credentialsJson) {
            console.warn('Google Drive enabled but credentials missing. Skipping.');
            return null;
        }
        // 2. Parse credentials and initialize Auth
        const credentials = JSON.parse(credentialsJson);
        const auth = new googleapis_1.google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        // --- NEW: Access Check ---
        if (folderId) {
            try {
                console.log(`[CloudSync] Checking access to folder: ${folderId}`);
                const folder = yield drive.files.get({
                    fileId: folderId,
                    fields: 'id, name, capabilities',
                    supportsAllDrives: true,
                });
                console.log(`[CloudSync] Access verified. Folder Name: "${folder.data.name}"`);
            }
            catch (err) {
                console.error(`[CloudSync] Access Denied to folder "${folderId}": ${err.message}`);
                return null;
            }
        }
        // 3. Prepare file metadata
        const fileMetadata = {
            name: fileName,
        };
        if (folderId) {
            fileMetadata.parents = [folderId];
        }
        console.log(`[CloudSync] Metadata: ${JSON.stringify(fileMetadata)}`);
        const media = {
            mimeType: 'application/sql',
            body: fs_1.default.createReadStream(filePath),
        };
        // 4. Perform upload
        console.log(`[CloudSync] Uploading ${fileName} to Google Drive...`);
        const response = yield drive.files.create({
            requestBody: {
                name: fileName,
                parents: folderId ? [folderId] : []
            },
            media: {
                body: fs_1.default.createReadStream(filePath),
            },
            fields: 'id',
            supportsAllDrives: true,
        });
        console.log('[CloudSync] Success. File ID:', response.data.id);
        // Update last cloud backup setting
        yield prisma_1.default.systemSetting.upsert({
            where: { key: 'lastCloudBackupRun' },
            update: { value: new Date().toISOString() },
            create: { key: 'lastCloudBackupRun', value: new Date().toISOString() }
        });
        return response.data.id;
    }
    catch (error) {
        // We catch and log all errors here so the local backup process is NEVER interrupted
        console.error('[CloudSync] Error:', error.message);
        return null;
    }
});
exports.uploadToGoogleDrive = uploadToGoogleDrive;
