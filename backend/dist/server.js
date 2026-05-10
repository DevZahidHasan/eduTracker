"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const cron_service_1 = require("./services/cron.service");
const PORT = process.env.PORT || 5000;
// Initialize background tasks
(0, cron_service_1.initCronJobs)();
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
