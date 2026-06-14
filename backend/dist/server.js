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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const cron_service_1 = require("./services/cron.service");
const child_process_1 = require("child_process");
const PORT = process.env.PORT || 5000;
console.log(`Server starting...`);
console.log(`PORT environment variable: ${process.env.PORT}`);
// Function to run database migrations
const runMigrations = () => {
    return new Promise((resolve, reject) => {
        console.log('Checking for database migrations...');
        (0, child_process_1.exec)('npx prisma migrate deploy', (error, stdout, stderr) => {
            if (error) {
                console.error(`Migration error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.log(`Migration warning: ${stderr}`);
            }
            console.log(`Migration success: ${stdout}`);
            resolve(true);
        });
    });
};
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Run migrations first
        if (process.env.NODE_ENV === 'production' || process.env.AUTO_MIGRATE === 'true') {
            yield runMigrations();
        }
        // 2. Initialize background tasks
        try {
            (0, cron_service_1.initCronJobs)();
        }
        catch (error) {
            console.error('Failed to initialize cron jobs:', error);
        }
        // 3. Start listening
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
    }
    catch (err) {
        console.error('Failed to start server due to migration failure:', err);
        process.exit(1);
    }
});
startServer();
