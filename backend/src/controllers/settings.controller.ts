import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { runEndOfDayTasks } from '../services/cron.service';
import { performDatabaseBackup } from '../services/backup.service';
import { sendWhatsAppMessage } from '../services/whatsapp.service';
import fs from 'fs';
import path from 'path';

export const getSchoolProfile = asyncHandler(async (req: Request, res: Response) => {
  let profile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  if (!profile) {
    profile = await prisma.schoolProfile.create({ data: {} });
  }
  return res.status(200).json(new ApiResponse(200, profile, 'School profile fetched successfully'));
});

export const updateSchoolProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, address, phone, email, academicYear, logo, website } = req.body;
  const profile = await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: { name, address, phone, email, academicYear, logo, website },
    create: { name, address, phone, email, academicYear, logo, website },
  });
  return res.status(200).json(new ApiResponse(200, profile, 'School profile updated successfully'));
});

export const uploadLogo = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  // Construct the logo URL
  const protocol = req.protocol;
  const host = req.get('host');
  const logoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  return res.status(200).json(new ApiResponse(200, { logoUrl }, 'Logo uploaded successfully'));
});

export const triggerEndOfDay = asyncHandler(async (req: Request, res: Response) => {
  const result = await runEndOfDayTasks();
  if (result.status === 'skipped') {
    return res.status(200).json(new ApiResponse(200, null, 'End of day tasks already ran for today.'));
  }
  return res.status(200).json(new ApiResponse(200, null, 'End of day tasks triggered successfully.'));
});

export const getSystemSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.systemSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  
  return res.status(200).json(new ApiResponse(200, settingsMap, 'System settings fetched successfully'));
});

export const updateSystemSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings } = req.body as { settings: Record<string, string> };

  if (settings && typeof settings === 'object') {
    const transaction = Object.entries(settings).map(([key, value]) => 
      prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await prisma.$transaction(transaction);
  }

  return res.status(200).json(new ApiResponse(200, null, 'System settings updated successfully'));
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = await prisma.user.update({
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

  return res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: Number(id) }
  });

  return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

export const triggerBackup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await performDatabaseBackup();

    // Check if cloud sync was attempted and if it failed
    const cloudEnabled = await prisma.systemSetting.findUnique({ where: { key: 'googleDriveEnabled' } });
    const lastCloud = await prisma.systemSetting.findUnique({ where: { key: 'lastCloudBackupRun' } });

    return res.status(200).json(new ApiResponse(200, {
      ...result,
      cloudSyncMessage: cloudEnabled?.value === 'true' && !result.cloudSynced 
        ? 'Local backup OK, but Cloud Sync failed. Check your Folder ID and Permissions.' 
        : 'Backup completed successfully.'
    }, 'Backup triggered successfully'));
  } catch (error: any) {
    return res.status(500).json(new ApiResponse(500, null, error.message || 'Failed to trigger backup'));
  }
});

// --- Grade Scale ---

export const getGradeScales = asyncHandler(async (req: Request, res: Response) => {
  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });
  return res.status(200).json(new ApiResponse(200, scales, 'Grade scales fetched successfully'));
});

export const createGradeScale = asyncHandler(async (req: Request, res: Response) => {
  const { grade, minScore, maxScore, points } = req.body;
  
  const scale = await prisma.gradeScale.create({
    data: { 
      grade, 
      minScore: parseFloat(minScore), 
      maxScore: parseFloat(maxScore), 
      points: parseFloat(points) 
    }
  });
  return res.status(201).json(new ApiResponse(201, scale, 'Grade scale created successfully'));
});

export const updateGradeScale = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { grade, minScore, maxScore, points } = req.body;

  const scale = await prisma.gradeScale.update({
    where: { id: Number(id) },
    data: { 
      grade, 
      minScore: parseFloat(minScore), 
      maxScore: parseFloat(maxScore), 
      points: parseFloat(points) 
    }
  });
  return res.status(200).json(new ApiResponse(200, scale, 'Grade scale updated successfully'));
});

export const deleteGradeScale = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.gradeScale.delete({ where: { id: Number(id) } });
  return res.status(200).json(new ApiResponse(200, null, 'Grade scale deleted successfully'));
});

// --- Backup Management ---

const getBackupDirectory = async () => {
  const pathSetting = await prisma.systemSetting.findUnique({
    where: { key: 'backupPath' }
  });
  return pathSetting?.value || path.join(process.cwd(), 'backups');
};

export const getBackups = asyncHandler(async (req: Request, res: Response) => {
  const backupDir = await getBackupDirectory();
  
  if (!fs.existsSync(backupDir)) {
    return res.status(200).json(new ApiResponse(200, [], 'Backups directory not found'));
  }

  const files = fs.readdirSync(backupDir);
  const backups = files
    .filter(f => f.endsWith('.sql'))
    .map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return res.status(200).json(new ApiResponse(200, backups, 'Backups fetched successfully'));
});

export const downloadBackup = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  const backupDir = await getBackupDirectory();
  const filePath = path.join(backupDir, filename);

  // Security check to prevent path traversal
  if (!filePath.startsWith(backupDir) || !fs.existsSync(filePath)) {
    throw new ApiError(404, 'Backup file not found');
  }

  res.download(filePath);
});

export const deleteBackup = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  const backupDir = await getBackupDirectory();
  const filePath = path.join(backupDir, filename);

  // Security check to prevent path traversal
  if (!filePath.startsWith(backupDir) || !fs.existsSync(filePath)) {
    throw new ApiError(404, 'Backup file not found');
  }

  fs.unlinkSync(filePath);
  return res.status(200).json(new ApiResponse(200, null, 'Backup deleted successfully'));
});

export const sendTestWhatsApp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) throw new ApiError(400, 'Phone number is required');

  const success = await sendWhatsAppMessage(phone, 'EduTrack Academy: This is a test message from your system configuration.');
  
  if (success) {
    return res.status(200).json(new ApiResponse(200, null, 'Test message sent successfully'));
  } else {
    throw new ApiError(500, 'Failed to send test message. Check your Twilio settings.');
  }
});
