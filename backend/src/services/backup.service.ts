import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import prisma from '../prisma';

const execPromise = promisify(exec);

export const performDatabaseBackup = async (customPath?: string) => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Get backup path from settings if not provided
    let backupDir = customPath;
    if (!backupDir) {
      const pathSetting = await prisma.systemSetting.findUnique({
        where: { key: 'backupPath' }
      });
      backupDir = pathSetting?.value || path.join(process.cwd(), 'backups');
    }

    // Ensure directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `edutracker_backup_${timestamp}.sql`;
    const fullPath = path.join(backupDir, filename);

    // Extract connection details from URL
    // Format: postgresql://USER:PASSWORD@HOST:PORT/DBNAME
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
    const match = dbUrl.match(regex);

    if (!match) {
      throw new Error('Could not parse DATABASE_URL');
    }

    const [_, user, password, host, port, dbname] = match;

    // Try to find pg_dump path from settings, fallback to common Windows path, then just 'pg_dump'
    const pgDumpPathSetting = await prisma.systemSetting.findUnique({ where: { key: 'pgDumpPath' } });
    const pgDumpBin = pgDumpPathSetting?.value || 'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';

    // Use PGPASSWORD environment variable to avoid interactive prompt
    const command = `"${pgDumpBin}" -h ${host} -p ${port} -U ${user} -d ${dbname} -F p -f "${fullPath}"`;
    
    try {
      await execPromise(command, {
        env: { ...process.env, PGPASSWORD: password }
      });
    } catch (execError: any) {
      console.error('pg_dump execution failed:', execError.message);
      
      // If the hardcoded path failed, try the simple command as a last resort
      if (pgDumpBin !== 'pg_dump') {
          const fallbackCommand = `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbname} -F p -f "${fullPath}"`;
          try {
              await execPromise(fallbackCommand, { env: { ...process.env, PGPASSWORD: password } });
          } catch (fallbackError: any) {
              throw new Error(`Backup utility (pg_dump) not found. Checked: ${pgDumpBin} and system path. Please ensure PostgreSQL Command Line Tools are installed.`);
          }
      } else {
          throw execError;
      }
    }
    
    // Log in system settings
    await prisma.systemSetting.upsert({
      where: { key: 'lastBackupRun' },
      update: { value: new Date().toISOString() },
      create: { key: 'lastBackupRun', value: new Date().toISOString() }
    });

    return { 
      success: true, 
      filename, 
      path: fullPath, 
      timestamp: new Date().toISOString() 
    };
  } catch (error: any) {
    console.error('Backup failed:', error);
    throw error;
  }
};
