import dotenv from 'dotenv';
dotenv.config();
import { performDatabaseBackup } from './src/services/backup.service';

async function test() {
  console.log('Starting manual backup test...');
  try {
    const result = await performDatabaseBackup();
    console.log('Backup Result:', JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error('TEST FAILED:', err.message);
  }
}

test();
