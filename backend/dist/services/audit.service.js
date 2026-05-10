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
exports.AuditService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class AuditService {
    /**
     * Logs a generic action to the audit log
     */
    static log(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { action, entityType, entityId, performedBy, oldValue, newValue, metadata } = params;
                yield prisma_1.default.auditLog.create({
                    data: {
                        action,
                        entityType,
                        entityId,
                        performedBy,
                        oldValue: oldValue || undefined,
                        newValue: newValue || undefined,
                        // We can add metadata if we want to store extra context like IP, browser, etc.
                        // For now, it's just stored in the JSON fields if needed.
                    },
                });
            }
            catch (error) {
                console.error('AuditService.log failed:', error);
            }
        });
    }
    /**
     * Specifically logs a CRUD operation with before/after state
     */
    static logChange(action, entityType, entityId, userId, oldData, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.log({
                action,
                entityType,
                entityId: String(entityId),
                performedBy: userId,
                oldValue: oldData,
                newValue: newData
            });
        });
    }
    /**
     * Helper to log attendance changes
     */
    static logAttendance(userId, studentId, status, date, oldStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logChange(oldStatus ? 'UPDATE' : 'CREATE', 'Attendance', `${studentId}-${date.toISOString().split('T')[0]}`, userId, oldStatus ? { status: oldStatus } : null, { status, date });
        });
    }
    /**
     * Helper to log mark changes
     */
    static logMark(userId, markId, oldValue, newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.logChange('UPDATE', 'Mark', markId, userId, oldValue, newValue);
        });
    }
}
exports.AuditService = AuditService;
