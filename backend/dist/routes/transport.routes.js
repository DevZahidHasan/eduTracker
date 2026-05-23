"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transport_controller_1 = require("../controllers/transport.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Vehicles
router.route('/vehicles')
    .get(transport_controller_1.getVehicles)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.createVehicle);
router.route('/vehicles/:id')
    .put((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.updateVehicle)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), transport_controller_1.deleteVehicle);
// Drivers
router.route('/drivers')
    .get(transport_controller_1.getDrivers)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.createDriver);
router.route('/drivers/:id')
    .put((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.updateDriver)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), transport_controller_1.deleteDriver);
// Routes
router.route('/routes')
    .get(transport_controller_1.getRoutes)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.createRoute);
router.route('/routes/:id')
    .put((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.updateRoute)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL'), transport_controller_1.deleteRoute);
// Stops
router.route('/routes/:routeId/stops')
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.addStopToRoute);
router.route('/stops/:id')
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), transport_controller_1.deleteStop);
// Assignments
router.route('/assign')
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), transport_controller_1.assignTransport);
router.route('/routes/:routeId/students')
    .get(transport_controller_1.getAssignedStudents);
exports.default = router;
