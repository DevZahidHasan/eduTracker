import { Router } from 'express';
import {
  getVehicles, createVehicle, updateVehicle, deleteVehicle,
  getDrivers, createDriver, updateDriver, deleteDriver,
  getRoutes, createRoute, updateRoute, deleteRoute,
  addStopToRoute, deleteStop,
  assignTransport, getAssignedStudents,
  updateRouteStatus
} from '../controllers/transport.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Vehicles
router.route('/vehicles')
  .get(getVehicles)
  .post(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), createVehicle);
router.route('/vehicles/:id')
  .put(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), updateVehicle)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteVehicle);

// Drivers
router.route('/drivers')
  .get(getDrivers)
  .post(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), createDriver);
router.route('/drivers/:id')
  .put(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), updateDriver)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteDriver);

// Routes
router.route('/routes')
  .get(getRoutes)
  .post(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), createRoute);
router.route('/routes/:id')
  .put(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), updateRoute)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteRoute);

// Live Tracking Status Update
router.route('/routes/:id/status')
  .put(authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), updateRouteStatus);

// Stops
router.route('/routes/:routeId/stops')
  .post(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), addStopToRoute);
router.route('/stops/:id')
  .delete(authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), deleteStop);

// Assignments
router.route('/assign')
  .post(authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), assignTransport);
router.route('/routes/:routeId/students')
  .get(getAssignedStudents);

export default router;