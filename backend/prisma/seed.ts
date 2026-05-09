import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edutracker.com' },
    update: {},
    create: {
      email: 'admin@edutracker.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const classes = [
    'PLAY', 'NURSERY', 'KG', 'CLASS_1', 'CLASS_2', 'CLASS_3', 
    'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'
  ];

  const subjects = [
    'BANGLA', 'ENGLISH', 'MATH', 'SCIENCE', 'ICT', 'RELIGION', 'SOCIAL_SCIENCE'
  ];

  const examTypes = [
    'CLASS_TEST', 'MONTHLY_EXAM', 'MID_TERM', 'FINAL_EXAM', 'OTHER'
  ];

  for (const name of classes) {
    await prisma.schoolClass.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const name of examTypes) {
    await prisma.examType.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
