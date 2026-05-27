import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { initCronJobs } from './services/cron.service';
import { exec } from 'child_process';

const PORT = process.env.PORT || 5000;

console.log(`Server starting...`);
console.log(`PORT environment variable: ${process.env.PORT}`);

// Function to run database migrations
const runMigrations = () => {
  return new Promise((resolve, reject) => {
    console.log('Checking for database migrations...');
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
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
      console.error('Failed to initialize cron jobs:', error);
    }

    // 3. Start listening
    const server = app.listen(PORT, () => {
      const isPipe = typeof PORT === 'string' && PORT.includes('\\\\.\\pipe\\');
      console.log(`Server is running on ${isPipe ? 'pipe ' + PORT : 'port ' + PORT}`);
    });

    server.on('error', (error: any) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
      }
    });
  } catch (err) {
    console.error('Failed to start server due to migration failure:', err);
    process.exit(1);
  }
};

startServer();
