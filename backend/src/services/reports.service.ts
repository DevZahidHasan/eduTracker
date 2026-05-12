import prisma from '../prisma';
import { generatePerformanceInsights } from './ai.service';

/**
 * Calculate GPA based on marks.
 * standard grading system (80+ = 5.0, 70+ = 4.0, 60+ = 3.5, 50+ = 3.0, 40+ = 2.0, 33+ = 1.0, <33 = 0.0)
 */
export const calculateGPA = (marks: { score: number, maxScore: number }[]): number => {
  if (marks.length === 0) return 0;

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

  return Math.round((totalPoints / marks.length) * 100) / 100;
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

  const attendanceRate = await getAttendanceStats(studentId);
  const gpa = calculateGPA(student.marks);
  
  // existing report if any
  const existingReport = student.reports[0];

  return {
    student,
    marks: student.marks,
    gpa,
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

  return await prisma.academicReport.upsert({
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

  const performance = students.map(s => ({
    id: s.id,
    fullName: s.fullName,
    rollNumber: s.rollNumber,
    gpa: calculateGPA(s.marks),
    totalScore: s.marks.reduce((acc, m) => acc + m.score, 0)
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
