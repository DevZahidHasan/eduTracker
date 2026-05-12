"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const cron_service_1 = require("./services/cron.service");
const PORT = process.env.PORT || 5000;
console.log(`Server starting...`);
console.log(`PORT environment variable: ${process.env.PORT}`);
// Initialize background tasks
try {
    (0, cron_service_1.initCronJobs)();
}
catch (error) {
    console.error('Failed to initialize cron jobs:', error);
}
const server = app_1.default.listen(PORT, () => {
    const isPipe = typeof PORT === 'string' && PORT.includes('\\\\.\\pipe\\');
    console.log(`Server is running on ${isPipe ? 'pipe ' + PORT : 'port ' + PORT}`);
});
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    }
});
