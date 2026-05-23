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
exports.initCronJobs = exports.runEndOfDayTasks = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../prisma"));
const email_service_1 = require("./email.service");
const backup_service_1 = require("./backup.service");
const runEndOfDayTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const todayDateString = new Date().toISOString().split('T')[0];
    // Check if we already ran today
    const lastRunSetting = yield prisma_1.default.systemSetting.findUnique({
        where: { key: 'lastEndOfDayRun' }
    });
    if ((lastRunSetting === null || lastRunSetting === void 0 ? void 0 : lastRunSetting.value) === todayDateString) {
        console.log(`End of day tasks already ran for ${todayDateString}. Skipping.`);
        return { status: 'skipped', message: 'Already ran today' };
    }
    console.log(`Running end of day tasks for ${todayDateString}...`);
    yield (0, email_service_1.sendDailyAttendanceReport)();
    // Mark as run
    yield prisma_1.default.systemSetting.upsert({
        where: { key: 'lastEndOfDayRun' },
        update: { value: todayDateString },
        create: { key: 'lastEndOfDayRun', value: todayDateString }
    });
    return { status: 'success', message: 'Tasks completed successfully' };
});
exports.runEndOfDayTasks = runEndOfDayTasks;
const initCronJobs = () => {
    // Run at 16:00 (4 PM) every day
    // You can customize the cron expression based on school hours
    node_cron_1.default.schedule('0 16 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Cron triggered: End of day tasks');
        yield (0, exports.runEndOfDayTasks)();
    }));
    // Run at 02:00 (2 AM) every day for database backup
    node_cron_1.default.schedule('0 2 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Cron triggered: Automated Database Backup');
        try {
            yield (0, backup_service_1.performDatabaseBackup)();
        }
        catch (error) {
            console.error('Scheduled backup failed:', error);
        }
    }));
    console.log('Cron jobs initialized');
};
exports.initCronJobs = initCronJobs;
