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
exports.deleteExamType = exports.deleteSubject = exports.deleteSection = exports.deleteClass = exports.updateExamType = exports.createExamType = exports.createSubject = exports.createSection = exports.createClass = exports.getConfig = void 0;
exports.formatLabel = formatLabel;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
// Trigger nodemon restart
exports.getConfig = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classes = yield prisma_1.default.schoolClass.findMany({
        include: { sections: true },
        orderBy: { name: 'asc' }
    });
    const subjects = yield prisma_1.default.subject.findMany({
        orderBy: { name: 'asc' }
    });
    const examTypes = yield prisma_1.default.examType.findMany({
        orderBy: { name: 'asc' }
    });
    const roles = yield prisma_1.default.role.findMany({
        orderBy: { name: 'asc' }
    });
    const teachers = yield prisma_1.default.user.findMany({
        where: { role: 'TEACHER' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    // Map to the format the frontend expects (value/label)
    const config = {
        classes: classes.map(c => ({
            value: c.name,
            label: formatLabel(c.name),
            sections: c.sections.map(s => ({ value: s.section, label: s.section }))
        })),
        subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
        examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name), baseMark: e.baseMark })),
        roles: roles.map(r => ({ value: r.name, label: formatLabel(r.name) })),
        teachers: teachers.map(t => ({ value: t.id.toString(), label: t.name || t.email }))
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, config, 'Configuration fetched successfully'));
}));
exports.createClass = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const className = name.toUpperCase().replace(/\s+/g, '_');
    const newClass = yield prisma_1.default.schoolClass.create({
        data: {
            name: className,
            sections: {
                create: { section: 'A' }
            }
        },
        include: { sections: true }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, newClass, 'Class created successfully with default Section A'));
}));
exports.createSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section } = req.body;
    if (!className || !section) {
        throw new apiError_1.ApiError(400, 'Class name and section are required');
    }
    const newSection = yield prisma_1.default.classSection.create({
        data: {
            className: className.toUpperCase().replace(/\s+/g, '_'),
            section: section.toUpperCase().trim()
        }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, newSection, 'Section created successfully'));
}));
exports.createSubject = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const subject = yield prisma_1.default.subject.create({
        data: { name: name.toUpperCase().replace(/\s+/g, '_') }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, subject, 'Subject created successfully'));
}));
exports.createExamType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, baseMark, weightage, isFinal, category, termNumber } = req.body;
    const examType = yield prisma_1.default.examType.create({
        data: {
            name: name.toUpperCase().replace(/\s+/g, '_'),
            baseMark: baseMark ? Number(baseMark) : 100,
            weightage: weightage ? Number(weightage) : 100,
            isFinal: isFinal === true,
            category: category || 'FINAL',
            termNumber: termNumber ? Number(termNumber) : 1
        }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, examType, 'Exam type created successfully'));
}));
exports.updateExamType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const { baseMark, weightage, isFinal, category, termNumber } = req.body;
    const examType = yield prisma_1.default.examType.update({
        where: { name },
        data: {
            baseMark: baseMark !== undefined ? Number(baseMark) : undefined,
            weightage: weightage !== undefined ? Number(weightage) : undefined,
            isFinal: isFinal !== undefined ? isFinal : undefined,
            category: category !== undefined ? category : undefined,
            termNumber: termNumber !== undefined ? Number(termNumber) : undefined
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, examType, 'Exam type updated successfully'));
}));
exports.deleteClass = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    // Safe Delete: Check if students exist in this class
    const studentCount = yield prisma_1.default.student.count({ where: { className: name } });
    if (studentCount > 0) {
        throw new apiError_1.ApiError(400, `Cannot delete class '${name}' because it contains ${studentCount} students. Please reassign or delete the students first.`);
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up empty sections and fee structures
        yield tx.classSection.deleteMany({ where: { className: name } });
        yield tx.feeStructure.deleteMany({ where: { className: name } });
        yield tx.schoolClass.delete({ where: { name } });
    }));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Class deleted successfully'));
}));
exports.deleteSection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, section } = req.params;
    // Safe Delete: Check if students exist in this section
    const studentCount = yield prisma_1.default.student.count({ where: { className, section } });
    if (studentCount > 0) {
        throw new apiError_1.ApiError(400, `Cannot delete Section '${section}' because it contains ${studentCount} students.`);
    }
    yield prisma_1.default.classSection.delete({
        where: {
            className_section: { className, section }
        }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Section deleted successfully'));
}));
exports.deleteSubject = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    // Safe Delete: Check if marks exist for this subject
    const markCount = yield prisma_1.default.mark.count({ where: { subject: name } });
    if (markCount > 0) {
        throw new apiError_1.ApiError(400, `Cannot delete subject '${name}' because it has ${markCount} recorded marks. Delete the marks first.`);
    }
    yield prisma_1.default.subject.delete({ where: { name } });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Subject deleted successfully'));
}));
exports.deleteExamType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    // Safe Delete: Check if marks or results exist
    const markCount = yield prisma_1.default.mark.count({ where: { examType: name } });
    if (markCount > 0) {
        throw new apiError_1.ApiError(400, `Cannot delete '${name}' because it has ${markCount} recorded marks.`);
    }
    yield prisma_1.default.examType.delete({ where: { name } });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Exam type deleted successfully'));
}));
function formatLabel(str) {
    // Only transform if it looks like an UPPER_CASE_CONSTANT
    if (!str.includes('_') && str !== str.toUpperCase())
        return str;
    // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
