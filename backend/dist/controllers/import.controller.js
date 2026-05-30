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
exports.getTemplates = exports.importBooks = exports.importStaff = exports.importStudents = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = __importDefault(require("../prisma"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Validates and transforms a single student row
 */
const validateStudentRow = (row, index) => {
    var _a;
    const errors = [];
    if (!row.fullName)
        errors.push('Full Name is required');
    if (!row.className)
        errors.push('Class Name is required');
    if (!row.section)
        errors.push('Section is required');
    if (!row.rollNumber)
        errors.push('Roll Number is required');
    const gender = (_a = row.gender) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    if (!gender || !['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
        errors.push('Gender must be MALE, FEMALE, or OTHER');
    }
    return {
        data: {
            studentId: row.studentId || null,
            fullName: row.fullName,
            className: row.className,
            section: row.section,
            rollNumber: String(row.rollNumber),
            gender: gender,
            email: row.email || null,
            phone: row.phone || null,
            parentName: row.parentName || null,
            parentPhone: row.parentPhone || null,
            address: row.address || null,
            bloodGroup: row.bloodGroup || null,
            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
            admissionDate: row.admissionDate ? new Date(row.admissionDate) : new Date(),
        },
        errors,
        index: index + 1
    };
};
exports.importStudents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new apiError_1.ApiError(400, 'No CSV file uploaded');
    const results = [];
    const validRecords = [];
    const failedRecords = [];
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });
    for (let i = 0; i < results.length; i++) {
        const { data, errors } = validateStudentRow(results[i], i);
        if (errors.length > 0) {
            failedRecords.push({ row: i + 1, errors });
            continue;
        }
        if (data.studentId) {
            const existing = yield prisma_1.default.student.findUnique({ where: { studentId: data.studentId } });
            if (existing) {
                failedRecords.push({ row: i + 1, errors: [`Student ID '${data.studentId}' already exists`] });
                continue;
            }
        }
        else {
            const year = new Date().getFullYear();
            const count = yield prisma_1.default.student.count({ where: { studentId: { startsWith: `STU-${year}` } } });
            data.studentId = `STU-${year}-${(count + validRecords.length + 1).toString().padStart(4, '0')}`;
        }
        validRecords.push(data);
    }
    let successCount = 0;
    if (validRecords.length > 0) {
        yield prisma_1.default.$transaction(validRecords.map(record => prisma_1.default.student.create({ data: record })));
        successCount = validRecords.length;
    }
    if (fs_1.default.existsSync(req.file.path))
        fs_1.default.unlinkSync(req.file.path);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        total: results.length,
        success: successCount,
        failed: failedRecords.length,
        errors: failedRecords
    }, `Imported ${successCount} students successfully.`));
}));
exports.importStaff = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new apiError_1.ApiError(400, 'No CSV file uploaded');
    const results = [];
    const validRecords = [];
    const failedRecords = [];
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });
    const defaultPassword = yield bcryptjs_1.default.hash('EduTracker123!', 10);
    for (let i = 0; i < results.length; i++) {
        const row = results[i];
        if (!row.email || !row.role || !row.name) {
            failedRecords.push({ row: i + 1, errors: ['Email, Name, and Role are required'] });
            continue;
        }
        const existing = yield prisma_1.default.user.findUnique({ where: { email: row.email } });
        if (existing) {
            failedRecords.push({ row: i + 1, errors: [`User with email '${row.email}' already exists`] });
            continue;
        }
        validRecords.push({
            email: row.email,
            name: row.name,
            role: row.role.toUpperCase(),
            phone: row.phone || null,
            nid: row.nid || null,
            address: row.address || null,
            password: defaultPassword,
            canLogin: true
        });
    }
    if (validRecords.length > 0) {
        yield prisma_1.default.user.createMany({ data: validRecords });
    }
    if (fs_1.default.existsSync(req.file.path))
        fs_1.default.unlinkSync(req.file.path);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        total: results.length,
        success: validRecords.length,
        failed: failedRecords.length,
        errors: failedRecords
    }, `Imported ${validRecords.length} staff members successfully.`));
}));
exports.importBooks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        throw new apiError_1.ApiError(400, 'No CSV file uploaded');
    const results = [];
    const validRecords = [];
    const failedRecords = [];
    yield new Promise((resolve, reject) => {
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });
    for (let i = 0; i < results.length; i++) {
        const row = results[i];
        if (!row.title || !row.author || !row.category) {
            failedRecords.push({ row: i + 1, errors: ['Title, Author, and Category are required'] });
            continue;
        }
        validRecords.push({
            title: row.title,
            author: row.author,
            category: row.category,
            isbn: row.isbn || null,
            publisher: row.publisher || null,
            totalCopies: parseInt(row.totalCopies) || 1,
            availableCopies: parseInt(row.totalCopies) || 1,
            location: row.location || null
        });
    }
    if (validRecords.length > 0) {
        yield prisma_1.default.book.createMany({ data: validRecords });
    }
    if (fs_1.default.existsSync(req.file.path))
        fs_1.default.unlinkSync(req.file.path);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        total: results.length,
        success: validRecords.length,
        failed: failedRecords.length,
        errors: failedRecords
    }, `Imported ${validRecords.length} books successfully.`));
}));
exports.getTemplates = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    let csvContent = "";
    switch (type) {
        case 'students':
            csvContent = "studentId,fullName,rollNumber,className,section,gender,email,dateOfBirth,bloodGroup,phone,parentName,parentPhone,address,admissionDate\n,John Doe,1,Class 1,A,MALE,john@example.com,2015-05-15,A+,1234567890,Jane Doe,0987654321,123 Street,2026-01-01";
            break;
        case 'books':
            csvContent = "title,author,isbn,publisher,category,totalCopies,location\nIntro to Science,Jane Smith,978-3-16-148410-0,Oxford,Science,5,Shelf A1";
            break;
        case 'staff':
            csvContent = "email,name,role,phone,nid,address\nteacher@school.com,Alice White,TEACHER,1122334455,NID-123,456 Lane";
            break;
        default:
            throw new apiError_1.ApiError(400, 'Invalid template type');
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_template.csv`);
    return res.send(csvContent);
}));
