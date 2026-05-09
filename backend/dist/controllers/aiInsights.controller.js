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
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
exports.getInsights = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { marks, attendance } = req.body;
    if (!marks || !attendance) {
        throw new apiError_1.ApiError(400, 'Marks and attendance data are required');
    }
    const insights = yield (0, ai_service_1.generatePerformanceInsights)(marks, attendance);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { result: insights }, 'Insights generated successfully'));
}));
