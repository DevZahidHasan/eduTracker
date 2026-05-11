import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { initCronJobs } from './services/cron.service';

const PORT = process.env.PORT || 5000;

console.log(`Server starting...`);
console.log(`PORT environment variable: ${process.env.PORT}`);

// Initialize background tasks
try {
  initCronJobs();
} catch (error) {
  console.error('Failed to initialize cron jobs:', error);
}

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
