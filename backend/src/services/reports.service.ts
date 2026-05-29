import prisma from '../prisma';
import { generatePerformanceInsights } from './ai.service';
import { formatLabel } from '../controllers/config.controller';

/**
 * Calculate GPA based on marks and GradeScale table.
 */
export const calculateGPA = async (marks: { score: number, maxScore: number }[]): Promise<{ gpa: number, grade: string }> => {
  if (marks.length === 0) return { gpa: 0, grade: 'N/A' };

  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });

  // If no scales defined, use a default fallback
  if (scales.length === 0) {
    const totalPoints = marks.reduce((acc, mark) => {
      const percentage = (mark.score / mark.maxScore) * 100;
      if (percentage >= 80) return acc + 5.0;
      if (percentage >= 70) return acc + 4.0;
      if (percentage >= 60) return acc + 3.5;
      if (percentage >= 50) return acc + 3.0;
      if (percentage >= 40) return acc + 2.0;
      if (percentage >= 33) return acc + 1.0;
      return acc + 0;
    }, 0);
    const gpa = Math.round((totalPoints / marks.length) * 100) / 100;
    
    const totalObtained = marks.reduce((acc, m) => acc + m.score, 0);
    const totalMax = marks.reduce((acc, m) => acc + m.maxScore, 0);
    const avgPercentage = (totalObtained / totalMax) * 100;
    let grade = 'F';
    if (avgPercentage >= 80) grade = 'A+';
    else if (avgPercentage >= 70) grade = 'A';
    else if (avgPercentage >= 60) grade = 'B';
    else if (avgPercentage >= 50) grade = 'C';
    else if (avgPercentage >= 40) grade = 'D';
    else if (avgPercentage >= 33) grade = 'E';

    return { gpa, grade };
  }

  const getPointsAndGrade = (percentage: number) => {
    for (const scale of scales) {
      if (percentage >= scale.minScore) {
        return { points: scale.points, grade: scale.grade };
      }
    }
    return { points: 0, grade: 'F' };
  };

  let totalPoints = 0;
  for (const mark of marks) {
    const percentage = (mark.score / mark.maxScore) * 100;
    const { points } = getPointsAndGrade(percentage);
    totalPoints += points;
  }

  const avgPoints = Math.round((totalPoints / marks.length) * 100) / 100;
  
  const totalObtained = marks.reduce((acc, m) => acc + m.score, 0);
  const totalMax = marks.reduce((acc, m) => acc + m.maxScore, 0);
  const avgPercentage = (totalObtained / totalMax) * 100;
  const { grade: overallGrade } = getPointsAndGrade(avgPercentage);

  return { gpa: avgPoints, grade: overallGrade };
};

export const getAttendanceStats = async (studentId: number, startDate?: Date, endDate?: Date) => {
  const where: any = { studentId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const attendances = await prisma.attendance.findMany({ where });
  const total = attendances.length;
  if (total === 0) return 0;

  const present = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  return Math.round((present / total) * 100);
};

export const getStudentReportData = async (studentId: number, examType: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      marks: {
        where: { examType }
      },
      reports: {
        where: { examType }
      }
    }
  });

  if (!student) return null;

  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });

  const getGrade = (percentage: number) => {
    if (scales.length === 0) {
      if (percentage >= 80) return 'A+';
      if (percentage >= 70) return 'A';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      if (percentage >= 40) return 'D';
      if (percentage >= 33) return 'E';
      return 'F';
    }
    for (const scale of scales) {
      if (percentage >= scale.minScore) return scale.grade;
    }
    return 'F';
  };

  const attendanceRate = await getAttendanceStats(studentId);
  const existingReport = student.reports[0];

  // --- Handle 'Annual Result' (Master Aggregation) specially ---
  if (examType === 'Annual Result') {
    const annualResult = await prisma.termResult.findFirst({
      where: { studentId, examType: 'Annual Result' }
    });

    if (!annualResult) return null;

    const allMarks = await prisma.mark.findMany({ where: { studentId } });
    const examTypes = await prisma.examType.findMany();
    const weightageMap: Record<string, number> = {};
    examTypes.forEach(e => { weightageMap[e.name] = e.weightage; });

    const subjectGroups: Record<string, { totalWeightedScore: number; totalWeight: number; termScores: Record<string, number> }> = {};
    const contributingTerms = new Set<string>();
    
    allMarks.forEach(m => {
      if (m.examType === 'Annual Result') return;
      contributingTerms.add(m.examType);
      const weight = weightageMap[m.examType] || 100;
      if (!subjectGroups[m.subject]) {
        subjectGroups[m.subject] = { totalWeightedScore: 0, totalWeight: 0, termScores: {} };
      }
      const percentage = (m.score / m.maxScore) * 100;
      subjectGroups[m.subject].totalWeightedScore += (percentage * weight);
      subjectGroups[m.subject].totalWeight += weight;
      subjectGroups[m.subject].termScores[m.examType] = m.score;
    });

    const marksWithGrades = Object.entries(subjectGroups).map(([subject, data], index) => {
      const finalPercentage = data.totalWeight > 0 ? (data.totalWeightedScore / data.totalWeight) : 0;
      
      // Calculate subject-level GPA from scales
      let subjectGpa = 0;
      if (scales.length > 0) {
        for (const scale of scales) {
          if (finalPercentage >= scale.minScore) {
            subjectGpa = scale.points;
            break;
          }
        }
      }

      return {
        id: index + 1000,
        subject: formatLabel(subject),
        termScores: data.termScores,
        score: Math.round(finalPercentage * 100) / 100, 
        maxScore: 100,
        gpa: subjectGpa,
        grade: getGrade(finalPercentage)
      };
    });

    return {
      student,
      marks: marksWithGrades,
      contributingTerms: Array.from(contributingTerms).map(t => ({ value: t, label: formatLabel(t) })),
      isAnnual: true,
      gpa: annualResult.gpa,
      grade: annualResult.grade,
      attendanceRate,
      teacherRemarks: existingReport?.teacherRemarks || '',
      aiInsights: existingReport?.aiInsights || ''
    };
  }

  // --- Handle 'Bangladesh Standard' (Tutorial + Final Exam) specially ---
  // Triggered if the examType includes "TERM_" (e.g., TERM_1, TERM_2)
  if (examType.startsWith('TERM_')) {
    const termNum = parseInt(examType.split('_')[1]);
    
    // Find all exam types belonging to this term number
    const termExamTypes = await prisma.examType.findMany({
      where: { termNumber: termNum }
    });

    const examTypeNames = termExamTypes.map(e => e.name);

    const allTermMarks = await prisma.mark.findMany({
      where: { 
        studentId,
        examType: { in: examTypeNames }
      }
    });

    // Group by subject
    const subjectMap: Record<string, { tutorial: number; final: number; total: number; max: number }> = {};
    
    allTermMarks.forEach(m => {
      const type = termExamTypes.find(t => t.name === m.examType);
      if (!subjectMap[m.subject]) {
        subjectMap[m.subject] = { tutorial: 0, final: 0, total: 0, max: 0 };
      }
      
      if (type?.category === 'TUTORIAL') {
        subjectMap[m.subject].tutorial += m.score;
      } else {
        subjectMap[m.subject].final += m.score;
      }
      subjectMap[m.subject].total += m.score;
      subjectMap[m.subject].max += m.maxScore;
    });

    const marksWithBreakdown = Object.entries(subjectMap).map(([subject, data], index) => {
      const percentage = (data.total / (data.max || 100)) * 100;
      
      // Calculate individual subject GPA from scales
      let subjectGpa = 0;
      if (scales.length > 0) {
        for (const scale of scales) {
          if (percentage >= scale.minScore) {
            subjectGpa = scale.points;
            break;
          }
        }
      }

      return {
        id: index + 5000,
        subject: formatLabel(subject),
        tutorial: data.tutorial,
        final: data.final,
        score: data.total,
        maxScore: data.max || 100,
        gpa: subjectGpa,
        grade: getGrade(percentage)
      };
    });

    const termSummaryMarks = marksWithBreakdown.map(m => ({ score: m.score, maxScore: m.maxScore }));
    const { gpa, grade } = await calculateGPA(termSummaryMarks);

    return {
      student,
      marks: marksWithBreakdown,
      isBDStandard: true,
      termNumber: termNum,
      gpa,
      grade,
      attendanceRate,
      teacherRemarks: existingReport?.teacherRemarks || '',
      aiInsights: existingReport?.aiInsights || ''
    };
  }

  // --- Standard Exam Type Logic ---
  const marksWithGrades = student.marks.map(m => ({
    ...m,
    grade: getGrade((m.score / m.maxScore) * 100)
  }));

  const { gpa, grade } = await calculateGPA(student.marks);

  return {
    student,
    marks: marksWithGrades,
    gpa,
    grade,
    attendanceRate,
    teacherRemarks: existingReport?.teacherRemarks || '',
    aiInsights: existingReport?.aiInsights || ''
  };
};

export const generateOrUpdateReport = async (studentId: number, examType: string, teacherRemarks?: string) => {
  const data = await getStudentReportData(studentId, examType);
  if (!data) return null;

  let aiInsights = data.aiInsights;
  if (!aiInsights) {
    aiInsights = await generatePerformanceInsights(data.marks as any, []); // Simplified call
  }

  const report = await prisma.academicReport.upsert({
    where: {
      studentId_examType: { studentId, examType }
    },
    update: {
      gpa: data.gpa,
      attendanceRate: data.attendanceRate,
      teacherRemarks: teacherRemarks !== undefined ? teacherRemarks : data.teacherRemarks,
      aiInsights
    },
    create: {
      studentId,
      examType,
      gpa: data.gpa,
      attendanceRate: data.attendanceRate,
      teacherRemarks: teacherRemarks || '',
      aiInsights
    }
  });

  // Also update TermResult for historical records
  const totalMarks = data.marks.reduce((acc, m) => acc + m.maxScore, 0);
  const obtainedMarks = data.marks.reduce((acc, m) => acc + m.score, 0);
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  const existingTermResult = await prisma.termResult.findFirst({
    where: { studentId, examType }
  });

  if (existingTermResult) {
    await prisma.termResult.update({
      where: { id: existingTermResult.id },
      data: {
        totalMarks,
        obtainedMarks,
        percentage,
        grade: data.grade,
        gpa: data.gpa,
        teacherRemarks: teacherRemarks || data.teacherRemarks
      }
    });
  } else {
    await prisma.termResult.create({
      data: {
        studentId,
        examType,
        totalMarks,
        obtainedMarks,
        percentage,
        grade: data.grade,
        gpa: data.gpa,
        teacherRemarks: teacherRemarks || data.teacherRemarks
      }
    });
  }

  return report;
};

export const getClassPerformance = async (className: string, examType: string, section?: string) => {
  const whereClause: any = { className };
  if (section) whereClause.section = section;

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      marks: { where: { examType } }
    }
  });

  const performance = await Promise.all(students.map(async (s) => {
    const { gpa, grade } = await calculateGPA(s.marks);
    return {
      id: s.id,
      fullName: s.fullName,
      rollNumber: s.rollNumber,
      gpa,
      grade,
      totalScore: s.marks.reduce((acc, m) => acc + m.score, 0)
    };
  }));

  const sorted = [...performance].sort((a, b) => b.totalScore - a.totalScore);
  
  const classAvg = sorted.length > 0 
    ? sorted.reduce((acc, s) => acc + s.gpa, 0) / sorted.length 
    : 0;

  return {
    className,
    examType,
    topStudents: sorted.slice(0, 5),
    weakStudents: sorted.slice(-5).reverse(),
    classAverageGPA: Math.round(classAvg * 100) / 100,
    totalStudents: students.length
  };
};

/**
 * Calculates a blended Annual Result based on the defined weightages of different ExamTypes.
 */
export const calculateAnnualResult = async (studentId: number) => {
  // 1. Fetch all TermResults and Marks to handle cases where TermReports aren't generated yet
  const termResults = await prisma.termResult.findMany({
    where: { studentId }
  });
  
  const marks = await prisma.mark.findMany({
    where: { studentId }
  });

  if (termResults.length === 0 && marks.length === 0) return null;

  // 2. Fetch ExamTypes to get weightages
  const examTypes = await prisma.examType.findMany();
  const weightageMap: Record<string, number> = {};
  examTypes.forEach(e => {
    weightageMap[e.name] = e.weightage;
  });

  // Group raw marks if TermResult is missing
  const termResultMap = new Map(termResults.map(tr => [tr.examType, tr]));
  const marksByExamType: Record<string, { obtained: number, total: number }> = {};
  
  marks.forEach(m => {
    if (m.examType === 'Annual Result' || m.examType === 'Final Result') return;
    if (!termResultMap.has(m.examType)) {
      if (!marksByExamType[m.examType]) {
        marksByExamType[m.examType] = { obtained: 0, total: 0 };
      }
      marksByExamType[m.examType].obtained += m.score;
      marksByExamType[m.examType].total += m.maxScore;
    }
  });

  // 3. Calculate weighted average percentage
  let totalWeightedPercentage = 0;
  let totalWeightageUsed = 0;

  // Process existing TermResults
  for (const tr of termResults) {
    // Ignore any existing Annual Results to prevent recursive calculation
    if (tr.examType === 'Annual Result' || tr.examType === 'Final Result') continue;

    const weight = weightageMap[tr.examType] || 100; // Default to 100% if not found
    totalWeightedPercentage += tr.percentage * weight;
    totalWeightageUsed += weight;
  }

  // Process raw Marks
  for (const [examType, data] of Object.entries(marksByExamType)) {
    const percentage = data.total > 0 ? (data.obtained / data.total) * 100 : 0;
    const weight = weightageMap[examType] || 100;
    totalWeightedPercentage += percentage * weight;
    totalWeightageUsed += weight;
  }

  if (totalWeightageUsed === 0) return null;

  const finalPercentage = totalWeightedPercentage / totalWeightageUsed;

  // 4. Convert final percentage back to Grade and GPA
  const scales = await prisma.gradeScale.findMany({
    orderBy: { minScore: 'desc' }
  });

  let finalGrade = 'F';
  let finalGpa = 0;

  if (scales.length > 0) {
    for (const scale of scales) {
      if (finalPercentage >= scale.minScore) {
        finalGrade = scale.grade;
        finalGpa = scale.points;
        break;
      }
    }
  }

  // 5. Upsert the "Annual Result" into TermResult
  const annualResult = await prisma.termResult.upsert({
    where: {
      id: (await prisma.termResult.findFirst({ where: { studentId, examType: 'Annual Result' } }))?.id || -1
    },
    update: {
      percentage: finalPercentage,
      grade: finalGrade,
      gpa: finalGpa,
      obtainedMarks: finalPercentage, // Symbolic representation
      totalMarks: 100, // Symbolic representation
      updatedAt: new Date()
    },
    create: {
      studentId,
      examType: 'Annual Result',
      percentage: finalPercentage,
      grade: finalGrade,
      gpa: finalGpa,
      obtainedMarks: finalPercentage,
      totalMarks: 100,
      status: 'FINAL'
    }
  });

  return annualResult;
};
