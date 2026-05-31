import { Request, Response } from 'express';
import prisma from '../prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

// --- Vehicles ---

export const getVehicles = asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { vehicleId: 'asc' } });
  res.status(200).json(new ApiResponse(200, vehicles, 'Vehicles fetched successfully'));
});

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { registrationNumber, make, model, capacity } = req.body;
  
  const lastVehicle = await prisma.vehicle.findFirst({ orderBy: { id: 'desc' } });
  const nextId = lastVehicle ? lastVehicle.id + 1001 : 1001;
  const vehicleId = `VH-${nextId}`;

  const vehicle = await prisma.vehicle.create({
    data: { vehicleId, registrationNumber, make, model, capacity: parseInt(capacity) || 0 }
  });
  res.status(201).json(new ApiResponse(201, vehicle, 'Vehicle created successfully'));
});

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const vehicle = await prisma.vehicle.update({ where: { id: parseInt(id) }, data });
  res.status(200).json(new ApiResponse(200, vehicle, 'Vehicle updated successfully'));
});

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.vehicle.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Vehicle deleted successfully'));
});

// --- Drivers ---

export const getDrivers = asyncHandler(async (req: Request, res: Response) => {
  const drivers = await prisma.driver.findMany({ include: { user: { select: { name: true } } } });
  res.status(200).json(new ApiResponse(200, drivers, 'Drivers fetched successfully'));
});

export const createDriver = asyncHandler(async (req: Request, res: Response) => {
  const { name, licenseNumber, phone, userId } = req.body;

  const lastDriver = await prisma.driver.findFirst({ orderBy: { id: 'desc' } });
  const nextId = lastDriver ? lastDriver.id + 1001 : 1001;
  const driverId = `DR-${nextId}`;

  const driver = await prisma.driver.create({
    data: { 
      driverId, 
      name, 
      licenseNumber, 
      phone, 
      userId: userId ? parseInt(userId) : undefined 
    },
    include: { user: { select: { name: true } } }
  });
  res.status(201).json(new ApiResponse(201, driver, 'Driver created successfully'));
});

export const updateDriver = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const driver = await prisma.driver.update({ where: { id: parseInt(id) }, data, include: { user: { select: { name: true } } } });
  res.status(200).json(new ApiResponse(200, driver, 'Driver updated successfully'));
});

export const deleteDriver = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.driver.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Driver deleted successfully'));
});

// --- Bus Routes & Stops ---

export const getRoutes = asyncHandler(async (req: Request, res: Response) => {
  const routes = await prisma.busRoute.findMany({
    include: {
      vehicle: true,
      driver: true,
      stops: { orderBy: { id: 'asc' } },
      _count: { select: { students: true } }
    }
  });
  res.status(200).json(new ApiResponse(200, routes, 'Routes fetched successfully'));
});

export const createRoute = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, vehicleId, driverId, fare, stops } = req.body;

  // Resolve internal IDs if unique string IDs are provided
  let vInternalId: number | undefined;
  let dInternalId: number | undefined;

  if (vehicleId) {
    const v = await prisma.vehicle.findUnique({ where: { vehicleId } });
    vInternalId = v?.id;
  }
  if (driverId) {
    const d = await prisma.driver.findUnique({ where: { driverId } });
    dInternalId = d?.id;
  }

  const route = await prisma.busRoute.create({
    data: {
      name,
      description,
      vehicleId: vInternalId,
      driverId: dInternalId,
      fare: parseFloat(fare) || 0,
      stops: {
        create: stops || []
      }
    },
    include: { stops: true }
  });
  res.status(201).json(new ApiResponse(201, route, 'Route created successfully'));
});

export const updateRoute = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, vehicleId, driverId, fare } = req.body;

  let vInternalId: number | null = null;
  let dInternalId: number | null = null;

  if (vehicleId) {
    const v = await prisma.vehicle.findUnique({ where: { vehicleId } });
    vInternalId = v?.id || null;
  }
  if (driverId) {
    const d = await prisma.driver.findUnique({ where: { driverId } });
    dInternalId = d?.id || null;
  }

  const route = await prisma.busRoute.update({
    where: { id: parseInt(id) },
    data: {
      name,
      description,
      vehicleId: vInternalId,
      driverId: dInternalId,
      fare: parseFloat(fare) || 0,
    }
  });
  res.status(200).json(new ApiResponse(200, route, 'Route updated successfully'));
});

export const deleteRoute = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.busRoute.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Route deleted successfully'));
});

// Stops Management

export const addStopToRoute = asyncHandler(async (req: Request, res: Response) => {
  const { routeId } = req.params;
  const data = req.body;
  const stop = await prisma.busStop.create({
    data: {
      ...data,
      routeId: parseInt(routeId)
    }
  });
  res.status(201).json(new ApiResponse(201, stop, 'Stop added successfully'));
});

export const deleteStop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.busStop.delete({ where: { id: parseInt(id) } });
  res.status(200).json(new ApiResponse(200, null, 'Stop deleted successfully'));
});

// --- Transport Assignment ---

export const assignTransport = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, busRouteId, busStopId } = req.body;
  
  const student = await prisma.student.update({
    where: { id: parseInt(studentId) },
    data: {
      busRouteId: busRouteId ? parseInt(busRouteId) : null,
      busStopId: busStopId ? parseInt(busStopId) : null
    },
    include: { busRoute: true, busStop: true }
  });

  res.status(200).json(new ApiResponse(200, student, 'Transport assigned successfully'));
});

export const getAssignedStudents = asyncHandler(async (req: Request, res: Response) => {
  const { routeId } = req.params;
  
  let whereClause: any = {};
  if (routeId !== 'all') {
    whereClause = { busRouteId: parseInt(routeId) };
  } else {
    whereClause = { busRouteId: { not: null } };
  }

  const students = await prisma.student.findMany({
    where: whereClause,
    include: { class: true, busStop: true, busRoute: { include: { vehicle: true } } }
  });
  res.status(200).json(new ApiResponse(200, students, 'Assigned students fetched successfully'));
});

// --- Live Tracking ---

export const updateRouteStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentStatus, delayMinutes, lastLocation } = req.body;

  const route = await prisma.busRoute.update({
    where: { id: parseInt(id) },
    data: {
      currentStatus,
      delayMinutes: parseInt(delayMinutes) || 0,
      lastLocation,
      lastStatusUpdate: new Date()
    }
  });

  res.status(200).json(new ApiResponse(200, route, 'Bus route status updated successfully'));
});

