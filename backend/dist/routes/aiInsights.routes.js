"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiInsights_controller_1 = require("../controllers/aiInsights.controller");
const router = (0, express_1.Router)();
router.post('/', aiInsights_controller_1.getInsights);
exports.default = router;
