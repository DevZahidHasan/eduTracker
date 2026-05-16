import prisma from '../prisma';
import { generatePerformanceInsights } from './ai.service';

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

  const marksWithGrades = student.marks.map(m => ({
    ...m,
    grade: getGrade((m.score / m.maxScore) * 100)
  }));

  const attendanceRate = await getAttendanceStats(studentId);
  const { gpa, grade } = await calculateGPA(student.marks);
  
  // existing report if any
  const existingReport = student.reports[0];

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
