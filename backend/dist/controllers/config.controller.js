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
exports.getConfig = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.getConfig = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classes = yield prisma_1.default.schoolClass.findMany({
        orderBy: { name: 'asc' }
    });
    const subjects = yield prisma_1.default.subject.findMany({
        orderBy: { name: 'asc' }
    });
    const examTypes = yield prisma_1.default.examType.findMany({
        orderBy: { name: 'asc' }
    });
    // Map to the format the frontend expects (value/label)
    const config = {
        classes: classes.map(c => ({ value: c.name, label: formatLabel(c.name) })),
        subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
        examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name) }))
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, config, 'Configuration fetched successfully'));
}));
function formatLabel(str) {
    // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
