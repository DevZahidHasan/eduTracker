"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassPerformance = exports.generateOrUpdateReport = exports.getStudentReportData = exports.getAttendanceStats = exports.calculateGPA = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const ai_service_1 = require("./ai.service");
/**
 * Calculate GPA based on marks and GradeScale table.
 */
const calculateGPA = (marks) => __awaiter(void 0, void 0, void 0, function* () {
    if (marks.length === 0)
        return { gpa: 0, grade: 'N/A' };
    const scales = yield prisma_1.default.gradeScale.findMany({
        orderBy: { minScore: 'desc' }
    });
    // If no scales defined, use a default fallback
    if (scales.length === 0) {
        const totalPoints = marks.reduce((acc, mark) => {
            const percentage = (mark.score / mark.maxScore) * 100;
            if (percentage >= 80)
                return acc + 5.0;
            if (percentage >= 70)
                return acc + 4.0;
            if (percentage >= 60)
                return acc + 3.5;
            if (percentage >= 50)
                return acc + 3.0;
            if (percentage >= 40)
                return acc + 2.0;
            if (percentage >= 33)
                return acc + 1.0;
            return acc + 0;
        }, 0);
        const gpa = Math.round((totalPoints / marks.length) * 100) / 100;
        const totalObtained = marks.reduce((acc, m) => acc + m.score, 0);
        const totalMax = marks.reduce((acc, m) => acc + m.maxScore, 0);
        const avgPercentage = (totalObtained / totalMax) * 100;
        let grade = 'F';
        if (avgPercentage >= 80)
            grade = 'A+';
        else if (avgPercentage >= 70)
            grade = 'A';
        else if (avgPercentage >= 60)
            grade = 'B';
        else if (avgPercentage >= 50)
            grade = 'C';
        else if (avgPercentage >= 40)
            grade = 'D';
        else if (avgPercentage >= 33)
            grade = 'E';
        return { gpa, grade };
    }
    const getPointsAndGrade = (percentage) => {
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
});
exports.calculateGPA = calculateGPA;
const getAttendanceStats = (studentId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { studentId };
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = startDate;
        if (endDate)
            where.date.lte = endDate;
    }
    const attendances = yield prisma_1.default.attendance.findMany({ where });
    const total = attendances.length;
    if (total === 0)
        return 0;
    const present = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    return Math.round((present / total) * 100);
});
exports.getAttendanceStats = getAttendanceStats;
const getStudentReportData = (studentId, examType) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findUnique({
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
    if (!student)
        return null;
    const scales = yield prisma_1.default.gradeScale.findMany({
        orderBy: { minScore: 'desc' }
    });
    const getGrade = (percentage) => {
        if (scales.length === 0) {
            if (percentage >= 80)
                return 'A+';
            if (percentage >= 70)
                return 'A';
            if (percentage >= 60)
                return 'B';
            if (percentage >= 50)
                return 'C';
            if (percentage >= 40)
                return 'D';
            if (percentage >= 33)
                return 'E';
            return 'F';
        }
        for (const scale of scales) {
            if (percentage >= scale.minScore)
                return scale.grade;
        }
        return 'F';
    };
    const marksWithGrades = student.marks.map(m => (Object.assign(Object.assign({}, m), { grade: getGrade((m.score / m.maxScore) * 100) })));
    const attendanceRate = yield (0, exports.getAttendanceStats)(studentId);
    const { gpa, grade } = yield (0, exports.calculateGPA)(student.marks);
    // existing report if any
    const existingReport = student.reports[0];
    return {
        student,
        marks: marksWithGrades,
        gpa,
        grade,
        attendanceRate,
        teacherRemarks: (existingReport === null || existingReport === void 0 ? void 0 : existingReport.teacherRemarks) || '',
        aiInsights: (existingReport === null || existingReport === void 0 ? void 0 : existingReport.aiInsights) || ''
    };
});
exports.getStudentReportData = getStudentReportData;
const generateOrUpdateReport = (studentId, examType, teacherRemarks) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, exports.getStudentReportData)(studentId, examType);
    if (!data)
        return null;
    let aiInsights = data.aiInsights;
    if (!aiInsights) {
        aiInsights = yield (0, ai_service_1.generatePerformanceInsights)(data.marks, []); // Simplified call
    }
    const report = yield prisma_1.default.academicReport.upsert({
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
    const existingTermResult = yield prisma_1.default.termResult.findFirst({
        where: { studentId, examType }
    });
    if (existingTermResult) {
        yield prisma_1.default.termResult.update({
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
    }
    else {
        yield prisma_1.default.termResult.create({
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
});
exports.generateOrUpdateReport = generateOrUpdateReport;
const getClassPerformance = (className, examType, section) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = { className };
    if (section)
        whereClause.section = section;
    const students = yield prisma_1.default.student.findMany({
        where: whereClause,
        include: {
            marks: { where: { examType } }
        }
    });
    const performance = yield Promise.all(students.map((s) => __awaiter(void 0, void 0, void 0, function* () {
        const { gpa, grade } = yield (0, exports.calculateGPA)(s.marks);
        return {
            id: s.id,
            fullName: s.fullName,
            rollNumber: s.rollNumber,
            gpa,
            grade,
            totalScore: s.marks.reduce((acc, m) => acc + m.score, 0)
        };
    })));
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
});
exports.getClassPerformance = getClassPerformance;
