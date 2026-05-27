import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma';

/**
 * Service to handle uploading files to Google Drive using a Service Account
 */
export const uploadToGoogleDrive = async (fileName: string, filePath: string) => {
  try {
    // 1. Get Google Drive settings from database
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: { in: ['googleDriveEnabled', 'googleDriveFolderId', 'googleDriveCredentials'] }
      }
    });

    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    // CRITICAL: Exit immediately if not explicitly enabled
    if (settingsMap['googleDriveEnabled'] !== 'true') {
      return null;
    }

    const folderId = settingsMap['googleDriveFolderId']?.trim();
    const credentialsJson = settingsMap['googleDriveCredentials'];

    console.log(`[CloudSync] Debug: FolderID="${folderId}", Enabled="${settingsMap['googleDriveEnabled']}"`);

    if (!credentialsJson) {
      console.warn('Google Drive enabled but credentials missing. Skipping.');
      return null;
    }

    // 2. Parse credentials and initialize Auth
    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // --- NEW: Access Check ---
    if (folderId) {
      try {
        console.log(`[CloudSync] Checking access to folder: ${folderId}`);
        const folder = await drive.files.get({
          fileId: folderId,
          fields: 'id, name, capabilities',
          supportsAllDrives: true,
        });
        console.log(`[CloudSync] Access verified. Folder Name: "${folder.data.name}"`);
      } catch (err: any) {
        console.error(`[CloudSync] Access Denied to folder "${folderId}": ${err.message}`);
        return null;
      }
    }

    // 3. Prepare file metadata
    const fileMetadata: any = {
      name: fileName,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    console.log(`[CloudSync] Metadata: ${JSON.stringify(fileMetadata)}`);

    const media = {
      mimeType: 'application/sql',
      body: fs.createReadStream(filePath),
    };

    // 4. Perform upload
    console.log(`[CloudSync] Uploading ${fileName} to Google Drive...`);
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : []
      },
      media: {
        body: fs.createReadStream(filePath),
      },
      fields: 'id',
      supportsAllDrives: true,
    } as any);

    console.log('[CloudSync] Success. File ID:', response.data.id);
    
    // Update last cloud backup setting
    await prisma.systemSetting.upsert({
      where: { key: 'lastCloudBackupRun' },
      update: { value: new Date().toISOString() },
      create: { key: 'lastCloudBackupRun', value: new Date().toISOString() }
    });

    return response.data.id;
  } catch (error: any) {
    // We catch and log all errors here so the local backup process is NEVER interrupted
    console.error('[CloudSync] Error:', error.message);
    return null;
  }
};
