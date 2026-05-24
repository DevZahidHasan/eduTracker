import cron from 'node-cron';
import prisma from '../prisma';
import { sendDailyAttendanceReport } from './email.service';
import { performDatabaseBackup } from './backup.service';

export const runEndOfDayTasks = async () => {
  const todayDateString = new Date().toISOString().split('T')[0];
  
  // Check if we already ran today
  const lastRunSetting = await prisma.systemSetting.findUnique({
    where: { key: 'lastEndOfDayRun' }
  });

  if (lastRunSetting?.value === todayDateString) {
    return { status: 'skipped', message: 'Already ran today' };
  }
  
  await sendDailyAttendanceReport();

  // Mark as run
  await prisma.systemSetting.upsert({
    where: { key: 'lastEndOfDayRun' },
    update: { value: todayDateString },
    create: { key: 'lastEndOfDayRun', value: todayDateString }
  });

  return { status: 'success', message: 'Tasks completed successfully' };
};

export const initCronJobs = () => {
  // Run at 16:00 (4 PM) every day
  // You can customize the cron expression based on school hours
  cron.schedule('0 16 * * *', async () => {
    await runEndOfDayTasks();
  });

  // Run at 02:00 (2 AM) every day for database backup
  cron.schedule('0 2 * * *', async () => {
    try {
      await performDatabaseBackup();
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  });
};
