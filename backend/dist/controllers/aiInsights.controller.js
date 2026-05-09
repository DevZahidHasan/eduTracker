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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = void 0;
const ai_service_1 = require("../services/ai.service");
const getInsights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { marks, attendance } = req.body;
        if (!marks || !attendance) {
            res.status(400).json({ error: 'Marks and attendance data are required.' });
            return;
        }
        const insights = yield (0, ai_service_1.generatePerformanceInsights)(marks, attendance);
        res.status(200).json({ result: insights });
    }
    catch (error) {
        console.error('Error generating insights:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});
exports.getInsights = getInsights;
