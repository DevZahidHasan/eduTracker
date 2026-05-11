import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import prisma from '../prisma';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';

import { Role } from '@prisma/client';

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  profileImage: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authMiddleware = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          profileImage: true,
        },
      });

      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      req.user = user as AuthUser;
      next();
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }
);

// Optional: Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }
    next();
  };
};
