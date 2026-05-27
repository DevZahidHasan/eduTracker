import prisma from '../src/prisma';
import { getStudentReportData } from '../src/services/reports.service';

async function testFetch() {
  console.log('--- Testing getStudentReportData for Annual Result ---');
  try {
    const student = await prisma.student.findFirst({ where: { studentId: 'TEST-2026-001' } });
    if (!student) {
      console.log('Test student not found. Run generate-report-data script first.');
      return;
    }
    
    const result = await getStudentReportData(student.id, 'Annual Result');
    console.log('SUCCESS:', JSON.stringify(result, null, 2).slice(0, 500) + '...');
  } catch (err: any) {
    console.error('FETCH FAILED ERROR:', err);
  }
}

testFetch().catch(console.error).finally(() => prisma.$disconnect());
