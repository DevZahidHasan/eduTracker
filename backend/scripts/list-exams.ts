import prisma from '../src/prisma';

async function listExams() {
  const exams = await prisma.examType.findMany();
  console.log('--- Current Exam Types ---');
  exams.forEach(e => {
    console.log(`- ${e.name} (Category: ${e.category}, Term: ${e.termNumber}, Weight: ${e.weightage}%)`);
  });
}

listExams().catch(console.error).finally(() => prisma.$disconnect());
