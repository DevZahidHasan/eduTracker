import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../prisma';
import { runEndOfDayTasks } from '../services/cron.service';

export const getSchoolProfile = asyncHandler(async (req: Request, res: Response) => {
  let profile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });
  if (!profile) {
    profile = await prisma.schoolProfile.create({ data: {} });
  }
  return res.status(200).json(new ApiResponse(200, profile, 'School profile fetched successfully'));
});

export const triggerEndOfDay = asyncHandler(async (req: Request, res: Response) => {
  const result = await runEndOfDayTasks();
  if (result.status === 'skipped') {
    return res.status(200).json(new ApiResponse(200, null, 'End of day tasks already ran for today.'));
  }
  return res.status(200).json(new ApiResponse(200, null, 'End of day tasks triggered successfully.'));
});

export const updateSchoolProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, address, phone, email, academicYear, logo } = req.body;
  const profile = await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: { name, address, phone, email, academicYear, logo },
    create: { name, address, phone, email, academicYear, logo },
  });
  return res.status(200).json(new ApiResponse(200, profile, 'School profile updated successfully'));
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

  // Prevent deleting the last admin or yourself if we had auth info here
  // For now, just a simple delete
  await prisma.user.delete({
    where: { id: Number(id) }
  });

  return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});
