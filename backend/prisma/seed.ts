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

  const teacherNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const teachers = [];
  for (const name of teacherNames) {
    const email = name.toLowerCase().replace(' ', '.') + '@edutracker.com';
    const teacher = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'TEACHER',
      },
    });
    teachers.push(teacher);
  }

  const classes = [
    'CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'
  ];

  const subjects = [
    'BANGLA', 'ENGLISH', 'MATH', 'SCIENCE', 'ICT', 'RELIGION', 'SOCIAL_SCIENCE'
  ];

  const examTypes = [
    'CLASS_TEST', 'MONTHLY_EXAM', 'MID_TERM', 'FINAL_EXAM', 'OTHER'
  ];

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

  const sections = ['A', 'B', 'C'];

  for (const className of classes) {
    await prisma.schoolClass.upsert({
      where: { name: className },
      update: {},
      create: { name: className }
    });

    for (const section of sections) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      await prisma.classSection.upsert({
        where: { className_section: { className, section } },
        update: { teacherId: teacher.id },
        create: {
          className,
          section,
          teacherId: teacher.id
        }
      });
      
      // Add some sample students
      for (let i = 1; i <= 5; i++) {
        const rollNumber = i.toString().padStart(2, '0');
        const studentId = `${className}-${section}-${rollNumber}`;
        await prisma.student.upsert({
          where: { studentId },
          update: {},
          create: {
            studentId,
            fullName: `Student ${className} ${section} ${rollNumber}`,
            rollNumber,
            className,
            section,
            gender: i % 2 === 0 ? 'MALE' : 'FEMALE'
          }
        });
      }
    }
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
