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
exports.returnBook = exports.issueBook = exports.getBookIssues = exports.deleteMember = exports.createMember = exports.getMembers = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBooks = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
// --- Book Management ---
exports.getBooks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield prisma_1.default.book.findMany({
        orderBy: { title: 'asc' },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, books, 'Books fetched successfully'));
}));
exports.createBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, isbn, publisher, category, totalCopies, location } = req.body;
    const book = yield prisma_1.default.book.create({
        data: {
            title,
            author,
            isbn,
            publisher,
            category,
            totalCopies: totalCopies || 1,
            availableCopies: totalCopies || 1,
            location,
        },
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, book, 'Book created successfully'));
}));
exports.updateBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, author, isbn, publisher, category, totalCopies, availableCopies, location } = req.body;
    const book = yield prisma_1.default.book.update({
        where: { id: parseInt(id) },
        data: { title, author, isbn, publisher, category, totalCopies, availableCopies, location },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, book, 'Book updated successfully'));
}));
exports.deleteBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.book.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Book deleted successfully'));
}));
// --- Library Members ---
exports.getMembers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield prisma_1.default.libraryMember.findMany({
        include: {
            student: { select: { fullName: true, className: true, section: true } },
            user: { select: { name: true, role: true } }
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, members, 'Members fetched successfully'));
}));
exports.createMember = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, userId } = req.body;
    if (!studentId && !userId) {
        throw new apiError_1.ApiError(400, 'Either studentId or userId must be provided');
    }
    let { memberId } = req.body;
    if (studentId) {
        const existing = yield prisma_1.default.libraryMember.findUnique({ where: { studentId: parseInt(studentId) } });
        if (existing) {
            throw new apiError_1.ApiError(400, 'Student is already a library member');
        }
    }
    if (!memberId) {
        const prefix = studentId ? 'STU' : 'USR';
        const id = studentId || userId;
        const random = Math.floor(1000 + Math.random() * 9000);
        memberId = `LIB-${prefix}-${id}-${random}`;
    }
    const member = yield prisma_1.default.libraryMember.create({
        data: {
            memberId,
            studentId: studentId ? parseInt(studentId) : undefined,
            userId: userId ? parseInt(userId) : undefined,
        },
        include: {
            student: { select: { fullName: true } },
            user: { select: { name: true } }
        }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, member, 'Member created successfully'));
}));
exports.deleteMember = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.libraryMember.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Member deleted successfully'));
}));
// --- Book Issues ---
exports.getBookIssues = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issues = yield prisma_1.default.bookIssue.findMany({
        include: {
            book: { select: { title: true, isbn: true } },
            member: {
                include: {
                    student: { select: { fullName: true, className: true, section: true } },
                    user: { select: { name: true, role: true } }
                }
            }
        },
        orderBy: { issueDate: 'desc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, issues, 'Issues fetched successfully'));
}));
exports.issueBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, memberId, issueDate, dueDate } = req.body;
    const member = yield prisma_1.default.libraryMember.findUnique({ where: { memberId: memberId } });
    if (!member || member.status !== 'ACTIVE') {
        throw new apiError_1.ApiError(400, 'Invalid or inactive Library Member ID');
    }
    const book = yield prisma_1.default.book.findUnique({ where: { id: parseInt(bookId) } });
    if (!book || book.availableCopies <= 0) {
        throw new apiError_1.ApiError(400, 'Book is not available');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const issue = yield tx.bookIssue.create({
            data: {
                bookId: parseInt(bookId),
                memberId: member.id,
                issueDate: issueDate ? new Date(issueDate) : undefined,
                dueDate: new Date(dueDate),
                status: 'ISSUED'
            },
            include: {
                book: { select: { title: true } },
                member: { include: { student: { select: { fullName: true } }, user: { select: { name: true } } } }
            }
        });
        yield tx.book.update({
            where: { id: parseInt(bookId) },
            data: { availableCopies: { decrement: 1 } }
        });
        return issue;
    }));
    res.status(201).json(new apiResponse_1.ApiResponse(201, result, 'Book issued successfully'));
}));
exports.returnBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fineAmount, notes } = req.body;
    const issue = yield prisma_1.default.bookIssue.findUnique({ where: { id: parseInt(id) } });
    if (!issue || issue.status === 'RETURNED') {
        throw new apiError_1.ApiError(400, 'Invalid or already returned issue');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const returned = yield tx.bookIssue.update({
            where: { id: parseInt(id) },
            data: {
                status: 'RETURNED',
                returnDate: new Date(),
                fineAmount: fineAmount ? parseFloat(fineAmount) : 0,
                notes
            }
        });
        yield tx.book.update({
            where: { id: issue.bookId },
            data: { availableCopies: { increment: 1 } }
        });
        return returned;
    }));
    res.status(200).json(new apiResponse_1.ApiResponse(200, result, 'Book returned successfully'));
}));
