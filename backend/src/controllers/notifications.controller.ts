import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get all notifications for the current user
 */
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: req.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Limit to 50 most recent
  });

  return res.status(200).json(
    new ApiResponse(200, notifications, 'Notifications fetched successfully')
  );
});

/**
 * Mark a notification as read
 */
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.notification.update({
    where: {
      id: parseInt(id),
      userId: req.user?.id, // Security: ensure it belongs to the user
    },
    data: {
      isRead: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Notification marked as read')
  );
});

/**
 * Mark all notifications as read for the current user
 */
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user?.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'All notifications marked as read')
  );
});

/**
 * Delete a notification
 */
export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.notification.delete({
    where: {
      id: parseInt(id),
      userId: req.user?.id,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Notification deleted')
  );
});

/**
 * Helper function to create notifications (internal use)
 */
export const createNotification = async (data: {
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
}) => {
  return await prisma.notification.create({
    data,
  });
};
