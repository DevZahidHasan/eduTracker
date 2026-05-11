import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get all users (staff)
 */
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      nid: true,
      phone: true,
      address: true,
      canLogin: true,
      profileImage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(
    new ApiResponse(200, users, 'Users fetched successfully')
  );
});

/**
 * Create a new user (staff)
 */
export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, name, role, nid, phone, address, canLogin, profileImage } = req.body;

  if (!email || !role) {
    throw new ApiError(400, 'Email and role are required');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  let hashedPassword = null;
  if (canLogin && password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      nid,
      phone,
      address,
      canLogin: !!canLogin,
      profileImage,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      nid: true,
      phone: true,
      address: true,
      canLogin: true,
      profileImage: true,
      createdAt: true,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, user, 'User created successfully')
  );
});

/**
 * Update a user (staff)
 */
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { email, name, role, password, nid, phone, address, canLogin, profileImage } = req.body;

  const userData: any = {
    email,
    name,
    role,
    nid,
    phone,
    address,
    canLogin: !!canLogin,
    profileImage,
  };

  if (password && canLogin) {
    userData.password = await bcrypt.hash(password, 10);
  } else if (!canLogin) {
    userData.password = null;
  }

  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      nid: true,
      phone: true,
      address: true,
      canLogin: true,
      profileImage: true,
      createdAt: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, user, 'User updated successfully')
  );
});

/**
 * Delete a user (staff)
 */
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (req.user?.id === parseInt(id)) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'User deleted successfully')
  );
});
