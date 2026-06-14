import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Basic Restore Script
 * This script demonstrates how to restore a PostgreSQL database backup
 * automatically using pg_restore or psql.
 * 
 * Usage: npx ts-node scripts/test-restore.ts <path-to-backup-file>
 */

function testRestore() {
  console.log('--- Automated Restore Test ---');
  
  const backupFile = process.argv[2];
  if (!backupFile || !fs.existsSync(backupFile)) {
    console.error('Error: Please provide a valid path to a backup file.');
    console.error('Example: npx ts-node scripts/test-restore.ts ./backups/edutracker_backup_2026-06-13.sql');
    process.exit(1);
  }

  const testDbName = 'edutracker_test_restore_automated';
  const pgUser = process.env.DB_USER || 'postgres';
  const pgPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD || '123456';
  const pgPath = '"C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe"';

  console.log(`Step 1: Preparing clean database '${testDbName}'...`);
  
  try {
    // Drop test database if exists
    execSync(`${pgPath} -U ${pgUser} -c "DROP DATABASE IF EXISTS ${testDbName} WITH (FORCE);"`, {
      env: { ...process.env, PGPASSWORD: pgPassword },
      stdio: 'ignore'
    });

    // Create fresh test database
    execSync(`${pgPath} -U ${pgUser} -c "CREATE DATABASE ${testDbName};"`, {
      env: { ...process.env, PGPASSWORD: pgPassword },
      stdio: 'ignore'
    });

    console.log(`Step 2: Restoring backup from ${backupFile}...`);
    // Restore the backup
    execSync(`${pgPath} -U ${pgUser} -d ${testDbName} -f "${path.resolve(backupFile)}"`, {
      env: { ...process.env, PGPASSWORD: pgPassword },
      stdio: 'ignore'
    });

    console.log(`Step 3: Verifying restored database...`);
    const result = execSync(`${pgPath} -U ${pgUser} -d ${testDbName} -t -c "SELECT COUNT(*) FROM \\"User\\";"`, {
      env: { ...process.env, PGPASSWORD: pgPassword },
      encoding: 'utf-8'
    });

    console.log(`Restore Successful! Users found in restored DB: ${result.trim()}`);
    console.log('Cleanup: Leaving the test database intact for manual inspection.');
  } catch (err: any) {
    console.error('Restore test failed:', err.message);
    process.exit(1);
  }
}

testRestore();
