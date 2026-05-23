import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Client Database Setup ---');

  // 1. Seed Essential Roles
  console.log('Seeding roles...');
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

  // 2. Create Default Admin User
  console.log('Creating default admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Default Admin: admin@school.com / admin123');

  // 3. Seed Document Templates (The 15 designs)
  console.log('Seeding document templates...');
  await prisma.documentTemplate.deleteMany({});
  
  const idCardTemplates = [
    {
      name: 'Classic Blue',
      type: 'ID_CARD',
      isDefault: true,
      config: {
        primaryColor: '#1e40af', secondaryColor: '#ffffff', textColor: '#1e293b',
        layout: 'portrait', showSchoolAddress: true, showSchoolPhone: true, showExpiryDate: true
      }
    },
    {
      name: 'Modern Dark',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#0f172a', secondaryColor: '#f8fafc', textColor: '#334155',
        layout: 'landscape', showSchoolAddress: true, showSchoolPhone: false, showExpiryDate: true
      }
    },
    {
      name: 'Emerald Professional',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#059669', secondaryColor: '#ecfdf5', textColor: '#064e3b',
        layout: 'portrait', showSchoolAddress: true, showSchoolPhone: true, showExpiryDate: false
      }
    },
    {
      name: 'Sunset Minimal',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#ea580c', secondaryColor: '#fff7ed', textColor: '#431407',
        layout: 'portrait', showSchoolAddress: false, showSchoolPhone: false, showExpiryDate: true
      }
    },
    {
      name: 'Royal Purple',
      type: 'ID_CARD',
      isDefault: false,
      config: {
        primaryColor: '#7c3aed', secondaryColor: '#f5f3ff', textColor: '#1e1b4b',
        layout: 'landscape', showSchoolAddress: true, showSchoolPhone: true, showExpiryDate: true
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
    await prisma.documentTemplate.create({ data: template });
  }

  // 4. Seed Empty School Profile
  console.log('Initializing school profile...');
  await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Your School Name',
      address: 'Update Address in Settings',
      phone: 'Update Phone',
      email: 'admin@school.com',
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
    }
  });

  console.log('--- Client Database Setup Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
