import prisma from '../src/prisma';
import { execSync } from 'child_process';
import path from 'path';

beforeAll(async () => {
  console.log('Resetting and seeding test database...');
  // Force use of test database to avoid dropping main database
  const testDbUrl = process.env.DATABASE_URL?.replace('edutracker', 'edutracker_test') || 'postgresql://postgres:123456@localhost:5432/edutracker_test?schema=public';
  process.env.DATABASE_URL = testDbUrl;
  
  execSync('npx prisma db push --force-reset', { 
    cwd: path.resolve(__dirname, '..'), 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testDbUrl, PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes' }
  });
  
  execSync('npx ts-node prisma/seed.ts', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testDbUrl, PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes' }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
