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
exports.deleteBankQuestion = exports.updateBankQuestion = exports.createBankQuestion = exports.getBankQuestionById = exports.getBankQuestions = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = __importDefault(require("../prisma"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
exports.getBankQuestions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, subject, chapter } = req.query;
    const filters = {};
    if (className)
        filters.className = className;
    if (subject)
        filters.subject = subject;
    if (chapter)
        filters.chapter = chapter;
    const questions = yield prisma_1.default.bankQuestion.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, questions, 'Questions retrieved successfully'));
}));
exports.getBankQuestionById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield prisma_1.default.bankQuestion.findUnique({
        where: { id: req.params.id },
    });
    if (!question) {
        throw new apiError_1.ApiError(404, 'Question not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, question, 'Question retrieved successfully'));
}));
exports.createBankQuestion = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, subject, chapter, questionType, questionText, marks, options, correctAnswer } = req.body;
    const newQuestion = yield prisma_1.default.bankQuestion.create({
        data: {
            className,
            subject,
            chapter,
            questionType,
            questionText,
            marks,
            options: options || [],
            correctAnswer,
        },
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, newQuestion, 'Question added to bank successfully'));
}));
exports.updateBankQuestion = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const question = yield prisma_1.default.bankQuestion.update({
        where: { id },
        data,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, question, 'Question updated successfully'));
}));
exports.deleteBankQuestion = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.bankQuestion.delete({
        where: { id: req.params.id },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Question deleted successfully'));
}));
