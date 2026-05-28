import prisma from '../src/prisma';

async function repopulate() {
  console.log('--- Repopulating CLASS_1 ---');

  // 1. Ensure Class exists
  const className = 'CLASS_1';
  const schoolClass = await prisma.schoolClass.upsert({
    where: { name: className },
    update: {},
    create: { name: className }
  });

  // 2. Add Sections A and B
  const sections = ['A', 'B'];
  for (const s of sections) {
    await prisma.classSection.upsert({
      where: { className_section: { className, section: s } },
      update: {},
      create: { className, section: s }
    });
  }
  console.log('Sections A and B restored.');

  // 3. Add Sample Students
  const sampleStudents = [
    { studentId: 'STU-2026-010', fullName: 'Emily Davis', rollNumber: '01', section: 'A' },
    { studentId: 'STU-2026-011', fullName: 'Noah Smith', rollNumber: '02', section: 'A' },
    { studentId: 'STU-2026-012', fullName: 'Sophia Brown', rollNumber: '01', section: 'B' },
    { studentId: 'STU-2026-013', fullName: 'Liam Wilson', rollNumber: '02', section: 'B' },
    { studentId: 'STU-2026-014', fullName: 'Ava Martinez', rollNumber: '03', section: 'A' },
  ];

  for (const stu of sampleStudents) {
    await prisma.student.upsert({
      where: { studentId: stu.studentId },
      update: { className, section: stu.section, rollNumber: stu.rollNumber },
      create: {
        ...stu,
        className,
        gender: Math.random() > 0.5 ? 'FEMALE' : 'MALE',
        email: `${stu.studentId.toLowerCase()}@example.com`
      }
    });
  }
  console.log(`${sampleStudents.length} students restored to CLASS_1.`);
}

repopulate().catch(console.error).finally(() => prisma.$disconnect());
