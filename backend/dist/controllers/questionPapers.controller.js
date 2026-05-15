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
exports.deleteQuestionPaper = exports.updateQuestionPaper = exports.createQuestionPaper = exports.exportPdf = exports.printQuestionPaper = exports.getQuestionPaperById = exports.getQuestionPapers = void 0;
const questionPapers_service_1 = require("../services/questionPapers.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = __importDefault(require("../prisma"));
const questionPaperHtmlGenerator_1 = require("../utils/questionPaperHtmlGenerator");
const pdfGenerator_1 = require("../utils/pdfGenerator");
exports.getQuestionPapers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const papers = yield questionPapers_service_1.questionPaperService.getAllQuestionPapers();
    res.status(200).json(new apiResponse_1.ApiResponse(200, papers, 'Question papers retrieved successfully'));
}));
exports.getQuestionPaperById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const paper = yield questionPapers_service_1.questionPaperService.getQuestionPaperById(id);
    if (!paper) {
        throw new apiError_1.ApiError(404, 'Question paper not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, paper, 'Question paper retrieved successfully'));
}));
exports.printQuestionPaper = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const paper = yield questionPapers_service_1.questionPaperService.getQuestionPaperById(id);
    if (!paper) {
        throw new apiError_1.ApiError(404, 'Question paper not found');
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findFirst();
    const schoolName = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.name) || 'EduTrack Academy';
    const html = (0, questionPaperHtmlGenerator_1.generateQuestionPaperHtml)(paper, schoolName);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
}));
exports.exportPdf = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const paper = yield questionPapers_service_1.questionPaperService.getQuestionPaperById(id);
    if (!paper) {
        throw new apiError_1.ApiError(404, 'Question paper not found');
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findFirst();
    const schoolName = (schoolProfile === null || schoolProfile === void 0 ? void 0 : schoolProfile.name) || 'EduTrack Academy';
    const html = (0, questionPaperHtmlGenerator_1.generateQuestionPaperHtml)(paper, schoolName);
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="question_paper_${id}.pdf"`);
    res.send(pdfBuffer);
}));
exports.createQuestionPaper = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new apiError_1.ApiError(401, 'Unauthorized');
    const paper = yield questionPapers_service_1.questionPaperService.createQuestionPaper(req.body, userId);
    res.status(201).json(new apiResponse_1.ApiResponse(201, paper, 'Question paper created successfully'));
}));
exports.updateQuestionPaper = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const paper = yield questionPapers_service_1.questionPaperService.updateQuestionPaper(id, req.body);
    res.status(200).json(new apiResponse_1.ApiResponse(200, paper, 'Question paper updated successfully'));
}));
exports.deleteQuestionPaper = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield questionPapers_service_1.questionPaperService.deleteQuestionPaper(id);
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Question paper deleted successfully'));
}));
