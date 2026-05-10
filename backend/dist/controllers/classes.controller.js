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
exports.getClassAnalytics = exports.updateRoutine = exports.getSectionDetail = exports.getClassesOverview = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
exports.getClassesOverview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classes = yield prisma_1.default.schoolClass.findMany({
        include: {
            sections: {
                include: {
                    teacher: {
                        select: { name: true, email: true }
                    },
                    _count: {
                        select: { students: true }
                    }
                }
            }
        }
    });
    const overview = yield Promise.all(classes.map((c) => __awaiter(void 0, void 0, void 0, function* () {
        const totalStudents = c.sections.reduce((acc, s) => acc + s._count.students, 0);
        // Average marks
        const marks = yield prisma_1.default.mark.aggregate({
            where: {
                student: { className: c.name }
            },
            _avg: { score: true }
        });
        // Attendance percentage
        const attendance = yield prisma_1.default.attendance.findMany({
            where: {
                student: { className: c.name }
            }
        });
        const totalAttendance = attendance.length;
        const presentAttendance = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const attendancePercentage = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;
        return {
            className: c.name,
            totalStudents,
            attendancePercentage: Math.round(attendancePercentage),
            averageMarks: marks._avg.score ? Math.round(marks._avg.score * 10) / 10 : 0,
            sections: c.sections.map(s => {
                var _a;
                return ({
                    section: s.section,
                    teacher: ((_a = s.teacher) === null || _a === void 0 ? void 0 : _a.name) || 'Unassigned',
                    studentCount: s._count.students
                });
            })
        };
    })));
    // Sort by class name (simple alphanumeric sort)
    overview.sort((a, b) => a.className.localeCompare(b.className, undefined, { numeric: true }));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, overview, 'Classes overview fetched successfully'));
}));
exports.getSectionDetail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section } = req.params;
    const classSection = yield prisma_1.default.classSection.findUnique({
        where: { className_section: { className, section } },
        include: {
            teacher: { select: { id: true, name: true, email: true } },
            students: {
                orderBy: { rollNumber: 'asc' }
            },
            routines: {
                include: {
                    periods: {
                        include: {
                            subject: true,
                            teacher: { select: { id: true, name: true } }
                        },
                        orderBy: { startTime: 'asc' }
                    }
                }
            }
        }
    });
    if (!classSection) {
        throw new apiError_1.ApiError(404, 'Section not found');
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, classSection, 'Section details fetched successfully'));
}));
exports.updateRoutine = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section } = req.params;
    const { routines } = req.body; // Array of { dayOfWeek: string, periods: Array<{ subjectId, teacherId, startTime, endTime, periodNumber }> }
    const classSection = yield prisma_1.default.classSection.findUnique({
        where: { className_section: { className, section } }
    });
    if (!classSection) {
        throw new apiError_1.ApiError(404, 'Section not found');
    }
    for (const r of routines) {
        const routine = yield prisma_1.default.routine.upsert({
            where: {
                classSectionId_dayOfWeek: {
                    classSectionId: classSection.id,
                    dayOfWeek: r.dayOfWeek
                }
            },
            update: {},
            create: {
                classSectionId: classSection.id,
                dayOfWeek: r.dayOfWeek
            }
        });
        // Clear existing periods for this routine and recreate
        yield prisma_1.default.period.deleteMany({ where: { routineId: routine.id } });
        if (r.periods && r.periods.length > 0) {
            yield prisma_1.default.period.createMany({
                data: r.periods.map((p) => ({
                    routineId: routine.id,
                    subjectId: p.subjectId,
                    teacherId: p.teacherId,
                    startTime: p.startTime,
                    endTime: p.endTime,
                    periodNumber: p.periodNumber
                }))
            });
        }
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Routine updated successfully'));
}));
exports.getClassAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Aggregate data for class-wise analytics
    const classes = yield prisma_1.default.schoolClass.findMany({
        include: {
            students: {
                include: {
                    marks: true,
                    attendances: true
                }
            }
        }
    });
    const analytics = classes.map(c => {
        let totalScore = 0;
        let totalMarksCount = 0;
        let totalAttendance = 0;
        let presentAttendance = 0;
        c.students.forEach(s => {
            s.marks.forEach(m => {
                totalScore += m.score;
                totalMarksCount++;
            });
            s.attendances.forEach(a => {
                totalAttendance++;
                if (a.status === 'PRESENT' || a.status === 'LATE') {
                    presentAttendance++;
                }
            });
        });
        return {
            className: c.name,
            avgScore: totalMarksCount > 0 ? totalScore / totalMarksCount : 0,
            attendanceRate: totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0,
            studentCount: c.students.length
        };
    });
    // Calculate top performing and weakest class
    const sortedByScore = [...analytics].sort((a, b) => b.avgScore - a.avgScore);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        trends: analytics,
        topClass: ((_a = sortedByScore[0]) === null || _a === void 0 ? void 0 : _a.className) || 'N/A',
        weakestClass: ((_b = sortedByScore[sortedByScore.length - 1]) === null || _b === void 0 ? void 0 : _b.className) || 'N/A'
    }, 'Class analytics fetched successfully'));
}));
