import { execSync } from 'child_process';
import prisma from '../src/prisma';
import fs from 'fs';
import path from 'path';

async function generateStressData() {
  console.log('--- Initiating Stress Test Data Generation ---');

  // 0. Ensure Classes exist to satisfy FK constraints
  console.log('Ensuring classes exist...');
  const classes = ['CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'];
  const sections = ['A', 'B', 'C', 'D'];

  for (const c of classes) {
    await prisma.schoolClass.upsert({
      where: { name: c },
      update: {},
      create: { name: c }
    });
    for (const s of sections) {
      await prisma.classSection.upsert({
        where: { className_section: { className: c, section: s } },
        update: {},
        create: { className: c, section: s }
      });
    }
  }

  // 1. Generate 2000 Students across 5 Classes
  console.log('Generating students...');
  const newStudents: any[] = [];
  
  const runId = Date.now().toString().slice(-6); // Unique prefix for this run

  for (let i = 1; i <= 2000; i++) {
    const className = classes[Math.floor(Math.random() * classes.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    newStudents.push({
      studentId: `STRESS-${runId}-${i}`,
      rollNumber: `R${runId}-${i}`,
      fullName: `Stress Test Student ${runId}-${i}`,
      className,
      section,
      gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
      address: `123 Stress Test Ave, City ${i}`,
      phone: `+1000${runId}${i.toString().padStart(4, '0')}`,
    });
  }

  // Use createMany to insert them quickly
  try {
    await prisma.student.createMany({
      data: newStudents,
      skipDuplicates: true,
    });
    console.log('Students generated successfully.');
  } catch(e: any) {
     console.error('Error generating students:', e.message);
  }

  // 2. Add some staff members
  console.log('Generating 50 staff members...');
  const staff = [];
  for (let i = 1; i <= 50; i++) {
    staff.push({
      name: `Teacher ${runId}-${i}`,
      email: `teacher${runId}-${i}@stress.test`,
      password: 'password123', // Doesn't need to be hashed just for load testing
      role: 'TEACHER',
      phone: `+1900${runId}${i.toString().padStart(4, '0')}`
    });
  }
  
  try {
     await prisma.user.createMany({
       data: staff as any,
       skipDuplicates: true
     });
     console.log('Staff generated successfully.');
  } catch(e: any) {
    console.error('Error generating staff:', e.message);
  }

  // 3. Test Database Query Performance
  console.log('\n--- Running Query Performance Tests ---');
  
  const startTimeCount = Date.now();
  const count = await prisma.student.count();
  const endTimeCount = Date.now();
  console.log(`Time to count ${count} students: ${endTimeCount - startTimeCount}ms`);

  const startTimeFind = Date.now();
  await prisma.student.findMany({
    where: { className: 'CLASS_10', gender: 'MALE' },
    orderBy: { fullName: 'asc' },
    take: 100
  });
  const endTimeFind = Date.now();
  console.log(`Time to filter & sort CLASS_10 students: ${endTimeFind - startTimeFind}ms`);

  // 4. Test Backup Performance Under Load
  console.log('\n--- Running Backup Performance Test ---');
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `stress_test_backup_${timestamp}.sql`);
  
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
    const match = dbUrl.match(regex);
    if (match) {
        const [_, user, password, host, port, dbname] = match;
        const backupStart = Date.now();
        try {
            const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';
            const cmd = `"${pgDumpPath}" -h ${host} -p ${port} -U ${user} -d ${dbname} -F p -f "${backupFile}"`;
            execSync(cmd, { env: { ...process.env, PGPASSWORD: password } });
            const backupEnd = Date.now();
            const stats = fs.statSync(backupFile);
            console.log(`Backup completed successfully in ${backupEnd - backupStart}ms.`);
            console.log(`Backup File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (err: any) {
            console.error('Backup test failed:', err.message);
        }
    }
  }

  console.log('\n--- Stress Test Completed Successfully ---');
}

generateStressData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
