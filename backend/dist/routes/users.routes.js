"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All user management routes are restricted to ADMIN
router.use((0, auth_middleware_1.authorize)('ADMIN'));
router.get('/', users_controller_1.getUsers);
router.post('/', users_controller_1.createUser);
router.put('/:id', users_controller_1.updateUser);
router.delete('/:id', users_controller_1.deleteUser);
exports.default = router;
