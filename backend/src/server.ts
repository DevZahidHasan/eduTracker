import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { initCronJobs } from './services/cron.service';
import { exec } from 'child_process';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

logger.info(`Server starting...`);
logger.info(`PORT environment variable: ${process.env.PORT}`);

// Function to run database migrations
const runMigrations = () => {
  return new Promise((resolve, reject) => {
    logger.info('Checking for database migrations...');
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        logger.error(`Migration error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        logger.warn(`Migration warning: ${stderr}`);
      }
      logger.info(`Migration success: ${stdout}`);
      resolve(true);
    });
  });
};

const startServer = async () => {
  try {
    // 1. Run migrations first
    if (process.env.NODE_ENV === 'production' || process.env.AUTO_MIGRATE === 'true') {
      await runMigrations();
    }

    // 2. Initialize background tasks
    try {
      initCronJobs();
    } catch (error) {
      logger.error('Failed to initialize cron jobs:', error);
    }

    // 3. Start listening
    const server = app.listen(PORT, () => {
      const isPipe = typeof PORT === 'string' && PORT.includes('\\\\.\\pipe\\');
      logger.info(`Server is running on ${isPipe ? 'pipe ' + PORT : 'port ' + PORT}`);
    });

    server.on('error', (error: any) => {
      logger.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use.`);
      }
    });
  } catch (err) {
    logger.error('Failed to start server due to migration failure:', err);
    process.exit(1);
  }
};

startServer();
