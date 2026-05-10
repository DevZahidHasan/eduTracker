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
 * Calculate GPA based on marks.
 * standard grading system (80+ = 5.0, 70+ = 4.0, 60+ = 3.5, 50+ = 3.0, 40+ = 2.0, 33+ = 1.0, <33 = 0.0)
 */
const calculateGPA = (marks) => {
    if (marks.length === 0)
        return 0;
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
    return Math.round((totalPoints / marks.length) * 100) / 100;
};
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
    const attendanceRate = yield (0, exports.getAttendanceStats)(studentId);
    const gpa = (0, exports.calculateGPA)(student.marks);
    // existing report if any
    const existingReport = student.reports[0];
    return {
        student,
        marks: student.marks,
        gpa,
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
    return yield prisma_1.default.academicReport.upsert({
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
});
exports.generateOrUpdateReport = generateOrUpdateReport;
const getClassPerformance = (className, examType) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield prisma_1.default.student.findMany({
        where: { className },
        include: {
            marks: { where: { examType } }
        }
    });
    const performance = students.map(s => ({
        id: s.id,
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        gpa: (0, exports.calculateGPA)(s.marks),
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
});
exports.getClassPerformance = getClassPerformance;
