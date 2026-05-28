import prisma from '../src/prisma';
import { calculateGPA } from '../src/services/reports.service';

async function testGrades() {
  console.log('--- Custom Grade Scales ---');
  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });
  console.log(scales);

  console.log('\n--- Testing Calculation ---');
  const testMarks = [
    { score: 95, maxScore: 100 }, // 95%
    { score: 75, maxScore: 100 }, // 75%
    { score: 45, maxScore: 100 }  // 45%
  ];

  for (const mark of testMarks) {
    const res = await calculateGPA([mark]);
    console.log(`Score: ${mark.score}/${mark.maxScore} (${mark.score/mark.maxScore*100}%) => GPA: ${res.gpa}, Grade: ${res.grade}`);
  }
}

testGrades().catch(console.error).finally(() => prisma.$disconnect());
