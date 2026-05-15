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
exports.updateExamType = exports.createExamType = exports.createSubject = exports.createSection = exports.createClass = exports.getConfig = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
exports.getConfig = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classes = yield prisma_1.default.schoolClass.findMany({
        orderBy: { name: 'asc' }
    });
    const subjects = yield prisma_1.default.subject.findMany({
        orderBy: { name: 'asc' }
    });
    const examTypes = yield prisma_1.default.examType.findMany({
        orderBy: { name: 'asc' }
    });
    const teachers = yield prisma_1.default.user.findMany({
        where: { role: 'TEACHER' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    // Map to the format the frontend expects (value/label)
    const config = {
        classes: classes.map(c => ({ value: c.name, label: formatLabel(c.name) })),
        subjects: subjects.map(s => ({ value: s.name, label: formatLabel(s.name) })),
        examTypes: examTypes.map(e => ({ value: e.name, label: formatLabel(e.name), baseMark: e.baseMark })),
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
    const { name, baseMark } = req.body;
    const examType = yield prisma_1.default.examType.create({
        data: {
            name: name.toUpperCase().replace(/\s+/g, '_'),
            baseMark: baseMark ? Number(baseMark) : 100
        }
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, examType, 'Exam type created successfully'));
}));
exports.updateExamType = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const { baseMark } = req.body;
    const examType = yield prisma_1.default.examType.update({
        where: { name },
        data: { baseMark: Number(baseMark) }
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, examType, 'Exam type updated successfully'));
}));
function formatLabel(str) {
    // Convert UPPER_CASE to Title Case (e.g. CLASS_1 -> Class 1)
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
