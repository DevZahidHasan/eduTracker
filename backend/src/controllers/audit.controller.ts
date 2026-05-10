import { Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { entityType, action, performedBy, limit = 50, offset = 0 } = req.query;

  const where: any = {};
  if (entityType) where.entityType = entityType as string;
  if (action) where.action = action as string;
  if (performedBy) where.performedBy = Number(performedBy);

  const logs = await prisma.auditLog.findMany({
    where,
    take: Number(limit),
    skip: Number(offset),
    orderBy: { timestamp: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });

  const total = await prisma.auditLog.count({ where });

  return res.status(200).json(
    new ApiResponse(200, { logs, total }, 'Audit logs fetched successfully')
  );
});
