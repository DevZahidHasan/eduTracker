import prisma from '../src/prisma';

async function main() {
  console.log('--- Generating Full BD Standard Test Data for Class 5A ---');

  // 1. Get Class 5A Students
  const students = await prisma.student.findMany({
    where: { className: 'CLASS_5', section: 'A' }
  });

  if (students.length === 0) {
    console.log('No students found in CLASS_5 Section A. Please add some students first!');
    return;
  }
  console.log(`Found ${students.length} students.`);

  // 2. Get Subjects
  const subjects = await prisma.subject.findMany({ take: 5 });
  if (subjects.length === 0) {
    console.log('No subjects found. Please create some subjects in settings first!');
    return;
  }
  const subjectNames = subjects.map(s => s.name);

  // 3. Configure BD Standard Exam Types
  const examConfigs = [
    { name: 'T1_TUTORIAL', baseMark: 30, weightage: 30, category: 'TUTORIAL', termNumber: 1 },
    { name: 'T1_FINAL', baseMark: 70, weightage: 70, category: 'FINAL', termNumber: 1 },
    { name: 'T2_TUTORIAL', baseMark: 30, weightage: 30, category: 'TUTORIAL', termNumber: 2 },
    { name: 'T2_FINAL', baseMark: 70, weightage: 70, category: 'FINAL', termNumber: 2 },
    { name: 'T3_TUTORIAL', baseMark: 30, weightage: 30, category: 'TUTORIAL', termNumber: 3 },
    { name: 'T3_FINAL', baseMark: 70, weightage: 70, category: 'FINAL', termNumber: 3 },
  ];

  for (const config of examConfigs) {
    await prisma.examType.upsert({
      where: { name: config.name },
      update: { ...config, isFinal: false },
      create: { ...config, isFinal: false }
    });
  }

  // 4. Generate Marks
  console.log('Inserting marks (this might take a moment)...');
  
  for (const student of students) {
    // Clear old data for a clean test
    await prisma.mark.deleteMany({ where: { studentId: student.id } });
    await prisma.termResult.deleteMany({ where: { studentId: student.id } });

    for (const exam of examConfigs) {
      for (const subName of subjectNames) {
        const isTutorial = exam.category === 'TUTORIAL';
        const max = isTutorial ? 30 : 70;
        // Generate random score: Tutorial (15-28), Final (35-65)
        const score = isTutorial ? Math.floor(Math.random() * 13) + 15 : Math.floor(Math.random() * 30) + 35;

        await prisma.mark.create({
          data: {
            studentId: student.id,
            examType: exam.name,
            subject: subName,
            score: score,
            maxScore: max,
            date: new Date()
          }
        });
      }
    }

    // 5. Generate Individual Term Results (Aggregates)
    for (let term = 1; term <= 3; term++) {
      const termExamNames = examConfigs.filter(e => e.termNumber === term).map(e => e.name);
      const termMarks = await prisma.mark.findMany({
        where: { studentId: student.id, examType: { in: termExamNames } }
      });

      const totalObtained = termMarks.reduce((acc, m) => acc + m.score, 0);
      const totalMax = termMarks.reduce((acc, m) => acc + m.maxScore, 0);
      const pct = (totalObtained / totalMax) * 100;

      await prisma.termResult.create({
        data: {
          studentId: student.id,
          examType: `TERM_${term}`,
          percentage: pct,
          obtainedMarks: totalObtained,
          totalMarks: totalMax,
          grade: pct >= 80 ? 'A+' : (pct >= 70 ? 'A' : (pct >= 60 ? 'B' : 'C')),
          gpa: pct >= 80 ? 5.0 : (pct >= 70 ? 4.0 : (pct >= 60 ? 3.5 : 3.0)),
          status: 'PUBLISHED'
        }
      });
    }
  }

  console.log('--- TEST DATA GENERATION COMPLETE ---');
  console.log('You can now test:');
  console.log('1. Reports -> Term 1/2/3 Report (BD Standard) -> See 30/70 columns');
  console.log('2. Reports -> Compile Annual Result -> Annual Master Report');
}

main().catch(console.error).finally(() => prisma.$disconnect());
