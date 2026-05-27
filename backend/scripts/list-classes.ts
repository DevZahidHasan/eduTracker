import prisma from '../src/prisma';

async function main() {
  const sections = await prisma.classSection.findMany();
  console.log('--- Class Sections ---');
  sections.forEach(s => {
    console.log(`${s.className} - ${s.section}`);
  });

  const students = await prisma.student.findMany({ take: 5 });
  console.log('\n--- Recent Students ---');
  students.forEach(s => {
    console.log(`${s.fullName} (${s.className}-${s.section}) Roll: ${s.rollNumber}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
