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
exports.getAssignedStudents = exports.assignTransport = exports.deleteStop = exports.addStopToRoute = exports.deleteRoute = exports.updateRoute = exports.createRoute = exports.getRoutes = exports.deleteDriver = exports.updateDriver = exports.createDriver = exports.getDrivers = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicles = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
// --- Vehicles ---
exports.getVehicles = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicles = yield prisma_1.default.vehicle.findMany({ orderBy: { vehicleId: 'asc' } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, vehicles, 'Vehicles fetched successfully'));
}));
exports.createVehicle = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber, make, model, capacity } = req.body;
    const lastVehicle = yield prisma_1.default.vehicle.findFirst({ orderBy: { id: 'desc' } });
    const nextId = lastVehicle ? lastVehicle.id + 1001 : 1001;
    const vehicleId = `VH-${nextId}`;
    const vehicle = yield prisma_1.default.vehicle.create({
        data: { vehicleId, registrationNumber, make, model, capacity: parseInt(capacity) || 0 }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, vehicle, 'Vehicle created successfully'));
}));
exports.updateVehicle = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const vehicle = yield prisma_1.default.vehicle.update({ where: { id: parseInt(id) }, data });
    res.status(200).json(new apiResponse_1.ApiResponse(200, vehicle, 'Vehicle updated successfully'));
}));
exports.deleteVehicle = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.vehicle.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Vehicle deleted successfully'));
}));
// --- Drivers ---
exports.getDrivers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield prisma_1.default.driver.findMany({ include: { user: { select: { name: true } } } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, drivers, 'Drivers fetched successfully'));
}));
exports.createDriver = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, licenseNumber, phone, userId } = req.body;
    const lastDriver = yield prisma_1.default.driver.findFirst({ orderBy: { id: 'desc' } });
    const nextId = lastDriver ? lastDriver.id + 1001 : 1001;
    const driverId = `DR-${nextId}`;
    const driver = yield prisma_1.default.driver.create({
        data: {
            driverId,
            name,
            licenseNumber,
            phone,
            userId: userId ? parseInt(userId) : undefined
        },
        include: { user: { select: { name: true } } }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, driver, 'Driver created successfully'));
}));
exports.updateDriver = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const driver = yield prisma_1.default.driver.update({ where: { id: parseInt(id) }, data, include: { user: { select: { name: true } } } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, driver, 'Driver updated successfully'));
}));
exports.deleteDriver = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.driver.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Driver deleted successfully'));
}));
// --- Bus Routes & Stops ---
exports.getRoutes = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const routes = yield prisma_1.default.busRoute.findMany({
        include: {
            vehicle: true,
            driver: true,
            stops: { orderBy: { id: 'asc' } },
            _count: { select: { students: true } }
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, routes, 'Routes fetched successfully'));
}));
exports.createRoute = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, vehicleId, driverId, fare, stops } = req.body;
    // Resolve internal IDs if unique string IDs are provided
    let vInternalId;
    let dInternalId;
    if (vehicleId) {
        const v = yield prisma_1.default.vehicle.findUnique({ where: { vehicleId } });
        vInternalId = v === null || v === void 0 ? void 0 : v.id;
    }
    if (driverId) {
        const d = yield prisma_1.default.driver.findUnique({ where: { driverId } });
        dInternalId = d === null || d === void 0 ? void 0 : d.id;
    }
    const route = yield prisma_1.default.busRoute.create({
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
    res.status(201).json(new apiResponse_1.ApiResponse(201, route, 'Route created successfully'));
}));
exports.updateRoute = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, vehicleId, driverId, fare } = req.body;
    let vInternalId = null;
    let dInternalId = null;
    if (vehicleId) {
        const v = yield prisma_1.default.vehicle.findUnique({ where: { vehicleId } });
        vInternalId = (v === null || v === void 0 ? void 0 : v.id) || null;
    }
    if (driverId) {
        const d = yield prisma_1.default.driver.findUnique({ where: { driverId } });
        dInternalId = (d === null || d === void 0 ? void 0 : d.id) || null;
    }
    const route = yield prisma_1.default.busRoute.update({
        where: { id: parseInt(id) },
        data: {
            name,
            description,
            vehicleId: vInternalId,
            driverId: dInternalId,
            fare: parseFloat(fare) || 0,
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, route, 'Route updated successfully'));
}));
exports.deleteRoute = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.busRoute.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Route deleted successfully'));
}));
// Stops Management
exports.addStopToRoute = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId } = req.params;
    const data = req.body;
    const stop = yield prisma_1.default.busStop.create({
        data: Object.assign(Object.assign({}, data), { routeId: parseInt(routeId) })
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, stop, 'Stop added successfully'));
}));
exports.deleteStop = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.busStop.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Stop deleted successfully'));
}));
// --- Transport Assignment ---
exports.assignTransport = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, busRouteId, busStopId } = req.body;
    const student = yield prisma_1.default.student.update({
        where: { id: parseInt(studentId) },
        data: {
            busRouteId: busRouteId ? parseInt(busRouteId) : null,
            busStopId: busStopId ? parseInt(busStopId) : null
        },
        include: { busRoute: true, busStop: true }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, student, 'Transport assigned successfully'));
}));
exports.getAssignedStudents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId } = req.params;
    let whereClause = {};
    if (routeId !== 'all') {
        whereClause = { busRouteId: parseInt(routeId) };
    }
    else {
        whereClause = { busRouteId: { not: null } };
    }
    const students = yield prisma_1.default.student.findMany({
        where: whereClause,
        include: { class: true, busStop: true, busRoute: { include: { vehicle: true } } }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, students, 'Assigned students fetched successfully'));
}));
