import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

// --- Asset Management ---

export const getAssets = asyncHandler(async (req: Request, res: Response) => {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, assets, 'Assets fetched successfully'));
});

export const getAssetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await prisma.asset.findUnique({
    where: { id: parseInt(id) },
    include: { maintenanceLogs: { orderBy: { date: 'desc' } } }
  });
  if (!asset) {
    throw new ApiError(404, 'Asset not found');
  }
  res.status(200).json(new ApiResponse(200, asset, 'Asset fetched successfully'));
});

export const createAsset = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, purchaseDate, purchaseCost, condition, location, serialNumber, warrantyExpiry, nextMaintenanceDate, notes } = req.body;

  // Generate unique assetId if not provided
  let { assetId } = req.body;
  if (!assetId) {
    const count = await prisma.asset.count();
    assetId = `AST-${(count + 1).toString().padStart(4, '0')}`;
  }

  const asset = await prisma.asset.create({
    data: {
      assetId,
      name,
      category,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      purchaseCost: parseFloat(purchaseCost) || 0,
      condition,
      location,
      serialNumber,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
      notes,
    },
  });
  res.status(201).json(new ApiResponse(201, asset, 'Asset created successfully'));
});

export const updateAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, purchaseDate, purchaseCost, condition, location, status, serialNumber, warrantyExpiry, nextMaintenanceDate, notes } = req.body;

  const asset = await prisma.asset.update({
    where: { id: parseInt(id) },
    data: {
      name,
      category,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      purchaseCost: purchaseCost !== undefined ? parseFloat(purchaseCost) : undefined,
      condition,
      location,
      status,
      serialNumber,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : undefined,
      notes,
    },
  });
  res.status(200).json(new ApiResponse(200, asset, 'Asset updated successfully'));
});

export const deleteAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.asset.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Asset deleted successfully'));
});

// --- Asset Maintenance ---

export const getAssetMaintenance = asyncHandler(async (req: Request, res: Response) => {
  const { assetId } = req.params;
  const maintenance = await prisma.assetMaintenance.findMany({
    where: { assetId: parseInt(assetId) },
    orderBy: { date: 'desc' },
  });
  res.status(200).json(new ApiResponse(200, maintenance, 'Maintenance logs fetched successfully'));
});

export const createAssetMaintenance = asyncHandler(async (req: Request, res: Response) => {
  const { assetId, date, description, cost, performedBy, nextMaintenanceDate } = req.body;

  const maintenance = await prisma.assetMaintenance.create({
    data: {
      assetId: parseInt(assetId),
      date: date ? new Date(date) : new Date(),
      description,
      cost: parseFloat(cost) || 0,
      performedBy,
    },
  });

  // Update next maintenance date on Asset if provided
  if (nextMaintenanceDate) {
    await prisma.asset.update({
      where: { id: parseInt(assetId) },
      data: { nextMaintenanceDate: new Date(nextMaintenanceDate) }
    });
  }

  res.status(201).json(new ApiResponse(201, maintenance, 'Maintenance log created successfully'));
});

export const deleteAssetMaintenance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.assetMaintenance.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Maintenance log deleted successfully'));
});
