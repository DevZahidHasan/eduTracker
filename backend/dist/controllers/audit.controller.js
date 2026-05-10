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
exports.getAuditLogs = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.getAuditLogs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { entityType, action, performedBy, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (entityType)
        where.entityType = entityType;
    if (action)
        where.action = action;
    if (performedBy)
        where.performedBy = Number(performedBy);
    const logs = yield prisma_1.default.auditLog.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { timestamp: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });
    const total = yield prisma_1.default.auditLog.count({ where });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { logs, total }, 'Audit logs fetched successfully'));
}));
