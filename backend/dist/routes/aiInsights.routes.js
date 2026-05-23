"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiInsights_controller_1 = require("../controllers/aiInsights.controller");
const router = (0, express_1.Router)();
router.post('/', aiInsights_controller_1.getInsights);
router.post('/generate-questions', aiInsights_controller_1.generateQuestions);
exports.default = router;
