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
  console.log('Starting seed...');

  console.log('Seeding Exam Types...');
  const examTypes = [
    { name: 'T1 Tutorial', baseMark: 20, weightage: 20, isFinal: false, category: 'TUTORIAL', termNumber: 1 },
    { name: 'Term 1', baseMark: 100, weightage: 80, isFinal: true, category: 'FINAL', termNumber: 1 },
    { name: 'T2 Tutorial', baseMark: 20, weightage: 20, isFinal: false, category: 'TUTORIAL', termNumber: 2 },
    { name: 'Term 2', baseMark: 100, weightage: 80, isFinal: true, category: 'FINAL', termNumber: 2 },
    { name: 'T3 Tutorial', baseMark: 20, weightage: 20, isFinal: false, category: 'TUTORIAL', termNumber: 3 },
    { name: 'Term 3', baseMark: 100, weightage: 80, isFinal: true, category: 'FINAL', termNumber: 3 },
  ];
  for (const et of examTypes) {
    await prisma.examType.upsert({
      where: { name: et.name },
      update: {
        baseMark: et.baseMark,
        weightage: et.weightage,
        isFinal: et.isFinal,
        category: et.category,
        termNumber: et.termNumber,
      },
      create: et,
    });
  }

  // 0. Seed Document Templates (Moving to top to ensure it runs)
  await prisma.documentTemplate.deleteMany({});
  
  const idCardTemplates = [
    {
      name: 'Classic Blue',
      type: 'ID_CARD',
      isDefault: true,
      config: {
        primaryColor: '#1e40af',
        secondaryColor: '#ffffff',
        textColor: '#1e293b',
        layout: 'portrait',
        showSchoolAddress: true,
        showSchoolPhone: true,
        showExpiryDate: true
      }
    },
    {
      name: 'Modern Dark',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#0f172a',
        secondaryColor: '#f8fafc',
        textColor: '#334155',
        layout: 'landscape',
        showSchoolAddress: true,
        showSchoolPhone: false,
        showExpiryDate: true
      }
    },
    {
      name: 'Emerald Professional',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#059669',
        secondaryColor: '#ecfdf5',
        textColor: '#064e3b',
        layout: 'portrait',
        showSchoolAddress: true,
        showSchoolPhone: true,
        showExpiryDate: false
      }
    },
    {
      name: 'Sunset Minimal',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#ea580c',
        secondaryColor: '#fff7ed',
        textColor: '#431407',
        layout: 'portrait',
        showSchoolAddress: false,
        showSchoolPhone: false,
        showExpiryDate: true
      }
    },
    {
      name: 'Royal Purple',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#7c3aed',
        secondaryColor: '#f5f3ff',
        textColor: '#1e1b4b',
        layout: 'landscape',
        showSchoolAddress: true,
        showSchoolPhone: true,
        showExpiryDate: true
      }
    }
  ];

  const certificateTemplates = [
    // Character Certificates
    {
      name: 'Formal Gold',
      type: 'CHARACTER_CERTIFICATE',
      isDefault: true,
      config: { primaryColor: '#b45309', borderStyle: 'double', titleFont: 'Georgia' }
    },
    {
      name: 'Modern Clean',
      type: 'CHARACTER_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#2563eb', borderStyle: 'solid', titleFont: 'Arial' }
    },
    {
      name: 'Elegant Silver',
      type: 'CHARACTER_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#475569', borderStyle: 'dashed', titleFont: 'Courier New' }
    },
    {
      name: 'Royal Blue',
      type: 'CHARACTER_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#1e3a8a', borderStyle: 'double', titleFont: 'Verdana' }
    },
    {
      name: 'Traditional Green',
      type: 'CHARACTER_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#15803d', borderStyle: 'solid', titleFont: 'Times New Roman' }
    },
    // Leaving Certificates
    {
      name: 'Vintage Script',
      type: 'LEAVING_CERTIFICATE',
      isDefault: true,
      config: { primaryColor: '#78350f', borderStyle: 'double', titleFont: 'Times New Roman' }
    },
    {
      name: 'Corporate Blue',
      type: 'LEAVING_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#1e3a8a', borderStyle: 'solid', titleFont: 'Verdana' }
    },
    {
      name: 'Simple Professional',
      type: 'LEAVING_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#334155', borderStyle: 'solid', titleFont: 'Arial' }
    },
    {
      name: 'Academic Red',
      type: 'LEAVING_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#b91c1c', borderStyle: 'double', titleFont: 'Georgia' }
    },
    {
      name: 'Classic Slate',
      type: 'LEAVING_CERTIFICATE',
      isDefault: false,
      config: { primaryColor: '#475569', borderStyle: 'dashed', titleFont: 'Courier New' }
    }
  ];

  for (const template of [...idCardTemplates, ...certificateTemplates]) {
    await prisma.documentTemplate.create({
      data: template
    });
  }
  console.log('Document templates seeded.');

  // 1. Seed Roles
  const roles = [
    { name: 'ADMIN', description: 'Full system access' },
    { name: 'PRINCIPAL', description: 'Academic and administrative oversight' },
    { name: 'TEACHER', description: 'Class and student management' },
    { name: 'STAFF', description: 'General school staff' },
    { name: 'LIBRARIAN', description: 'Library management' },
    { name: 'ACCOUNTANT', description: 'Financial management' },
    { name: 'CLERK', description: 'Front desk and admissions' },
    { name: 'SECURITY', description: 'Campus security' },
    { name: 'CLEANER', description: 'Maintenance staff' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log('Roles seeded.');

  // 2. Seed Users for each role
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  for (const role of roles) {
    const email = `${role.name.toLowerCase()}@edutracker.com`;
    await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        name: `${role.name.charAt(0) + role.name.slice(1).toLowerCase()} User`,
        password: hashedPassword,
        role: role.name,
      },
    });
  }
  console.log('Role-based users seeded with password: 123456');

  // 3. Seed Subjects & Exam Types
  const subjects = ['BANGLA', 'ENGLISH', 'MATH', 'SCIENCE', 'ICT', 'RELIGION', 'SOCIAL_SCIENCE'];
  const examTypes = ['CLASS_TEST', 'MONTHLY_EXAM', 'MID_TERM', 'FINAL_EXAM'];

  for (const name of subjects) {
    await prisma.subject.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of examTypes) {
    await prisma.examType.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Subjects and Exam Types seeded.');

  // 4. Seed Classes and Sections
  const classes = ['CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10'];
  const sections = ['A', 'B'];

  for (const className of classes) {
    await prisma.schoolClass.upsert({ where: { name: className }, update: {}, create: { name: className } });

    for (const section of sections) {
      await prisma.classSection.upsert({
        where: { className_section: { className, section } },
        update: {},
        create: { className, section }
      });
    }
  }
  console.log('Classes and Sections seeded.');

  // 5. Seed Students (Only if none exist)
  const studentCount = await prisma.student.count();
  if (studentCount === 0) {
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const className = classes[Math.floor(Math.random() * classes.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      
      const count = await prisma.student.count({ where: { className, section } });
      const rollNumber = (count + 1).toString().padStart(2, '0');
      const studentId = `STU-${new Date().getFullYear()}-${i.toString().padStart(4, '0')}`;

      await prisma.student.create({
        data: {
          studentId,
          fullName: `${firstName} ${lastName}`,
          rollNumber,
          className,
          section,
          gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
          phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
          admissionDate: new Date(),
        }
      });
    }
    console.log('100 dummy students seeded.');
  } else {
    console.log('Students already exist, skipping student seed.');
  }

  // 6. Seed School Profile
  await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'EduTracker Enterprise Academy',
      address: '123 Education Lane, Tech City',
      phone: '+880123456789',
      email: 'info@edutracker.com',
      website: 'www.edutracker.com',
      academicYear: '2026-2027'
    }
  });
  console.log('School Profile seeded.');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
