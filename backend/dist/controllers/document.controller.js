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
exports.generateCertificate = exports.generateIDCards = exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplates = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const pdfGenerator_1 = require("../utils/pdfGenerator");
const documentHtmlGenerator_1 = require("../utils/documentHtmlGenerator");
// --- Template Management ---
exports.getTemplates = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield prisma_1.default.documentTemplate.findMany({
        orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, templates, 'Templates fetched successfully'));
}));
exports.createTemplate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type, config, isDefault } = req.body;
    if (isDefault) {
        // Unset other defaults of the same type
        yield prisma_1.default.documentTemplate.updateMany({
            where: { type, isDefault: true },
            data: { isDefault: false }
        });
    }
    const template = yield prisma_1.default.documentTemplate.create({
        data: { name, type, config, isDefault: !!isDefault }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, template, 'Template created successfully'));
}));
exports.updateTemplate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, config, isDefault, type } = req.body;
    if (isDefault) {
        const currentTemplate = yield prisma_1.default.documentTemplate.findUnique({ where: { id: parseInt(id) } });
        const targetType = type || (currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.type);
        yield prisma_1.default.documentTemplate.updateMany({
            where: { type: targetType, isDefault: true },
            data: { isDefault: false }
        });
    }
    const template = yield prisma_1.default.documentTemplate.update({
        where: { id: parseInt(id) },
        data: { name, config, isDefault, type }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, template, 'Template updated successfully'));
}));
exports.deleteTemplate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.documentTemplate.delete({ where: { id: parseInt(id) } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Template deleted successfully'));
}));
// --- Document Generation ---
exports.generateIDCards = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentIds, templateId } = req.body;
    if (!studentIds || !Array.isArray(studentIds)) {
        throw new apiError_1.ApiError(400, 'studentIds array is required');
    }
    const students = yield prisma_1.default.student.findMany({
        where: { id: { in: studentIds.map(id => parseInt(id)) } },
        include: { class: true }
    });
    let template;
    if (templateId) {
        template = yield prisma_1.default.documentTemplate.findUnique({ where: { id: parseInt(templateId) } });
    }
    else {
        template = yield prisma_1.default.documentTemplate.findFirst({ where: { type: 'ID_CARD', isDefault: true } });
    }
    if (!template) {
        // If no template in DB, use a default fallback to avoid 404
        template = {
            config: {
                primaryColor: '#1e40af',
                secondaryColor: '#ffffff',
                textColor: '#1e293b',
                layout: 'portrait',
                showSchoolAddress: true,
                showSchoolPhone: true
            }
        };
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findFirst();
    const html = (0, documentHtmlGenerator_1.generateIDCardHtml)(students, schoolProfile, template.config);
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=id_cards.pdf');
    res.send(pdfBuffer);
}));
exports.generateCertificate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, templateId, type, date, issueNumber } = req.body;
    const student = yield prisma_1.default.student.findUnique({
        where: { id: parseInt(studentId) },
        include: { class: true }
    });
    if (!student)
        throw new apiError_1.ApiError(404, 'Student not found');
    let template;
    if (templateId) {
        template = yield prisma_1.default.documentTemplate.findUnique({ where: { id: parseInt(templateId) } });
    }
    else {
        template = yield prisma_1.default.documentTemplate.findFirst({ where: { type, isDefault: true } });
    }
    if (!template) {
        template = {
            config: {
                primaryColor: '#1e40af',
                borderStyle: 'double',
                titleFont: 'Georgia'
            }
        };
    }
    const schoolProfile = yield prisma_1.default.schoolProfile.findFirst();
    const html = (0, documentHtmlGenerator_1.generateCertificateHtml)(student, schoolProfile, template.config, { date, issueNumber, type });
    const pdfBuffer = yield (0, pdfGenerator_1.generatePdfFromHtml)(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${type.toLowerCase()}.pdf`);
    res.send(pdfBuffer);
}));
