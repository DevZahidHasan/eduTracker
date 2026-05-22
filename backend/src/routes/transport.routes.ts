import { Router } from 'express';
import {
  getVehicles, createVehicle, updateVehicle, deleteVehicle,
  getDrivers, createDriver, updateDriver, deleteDriver,
  getRoutes, createRoute, updateRoute, deleteRoute,
  addStopToRoute, deleteStop,
  assignTransport, getAssignedStudents
} from '../controllers/transport.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Vehicles
router.route('/vehicles')
  .get(getVehicles)
  .post(authorize('ADMIN', 'PRINCIPAL'), createVehicle);
router.route('/vehicles/:id')
  .put(authorize('ADMIN', 'PRINCIPAL'), updateVehicle)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteVehicle);

// Drivers
router.route('/drivers')
  .get(getDrivers)
  .post(authorize('ADMIN', 'PRINCIPAL'), createDriver);
router.route('/drivers/:id')
  .put(authorize('ADMIN', 'PRINCIPAL'), updateDriver)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteDriver);

// Routes
router.route('/routes')
  .get(getRoutes)
  .post(authorize('ADMIN', 'PRINCIPAL'), createRoute);
router.route('/routes/:id')
  .put(authorize('ADMIN', 'PRINCIPAL'), updateRoute)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteRoute);

// Stops
router.route('/routes/:routeId/stops')
  .post(authorize('ADMIN', 'PRINCIPAL'), addStopToRoute);
router.route('/stops/:id')
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteStop);

// Assignments
router.route('/assign')
  .post(authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), assignTransport);
router.route('/routes/:routeId/students')
  .get(getAssignedStudents);

export default router;