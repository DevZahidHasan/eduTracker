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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionPaperService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
exports.questionPaperService = {
    getAllQuestionPapers() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const where = {};
            if (filters.isTemplate !== undefined) {
                where.isTemplate = filters.isTemplate;
            }
            if (filters.className) {
                where.className = filters.className;
            }
            if (filters.subject) {
                where.subject = filters.subject;
            }
            return prisma_1.default.questionPaper.findMany({
                where,
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                    _count: {
                        select: { questions: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        });
    },
    getQuestionPaperById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.questionPaper.findUnique({
                where: { id },
                include: {
                    questions: {
                        orderBy: { order: 'asc' },
                    },
                    user: {
                        select: { name: true, email: true },
                    },
                },
            });
        });
    },
    createQuestionPaper(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questions } = data, paperData = __rest(data, ["questions"]);
            return prisma_1.default.questionPaper.create({
                data: Object.assign(Object.assign({}, paperData), { createdBy: userId, questions: {
                        create: questions || [],
                    } }),
                include: {
                    questions: true,
                },
            });
        });
    },
    duplicateQuestionPaper(id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, userId, options = {}) {
            var _a;
            const originalPaper = yield this.getQuestionPaperById(id);
            if (!originalPaper)
                throw new Error('Original paper not found');
            const _b = originalPaper, { id: _, questions, user: __, createdAt: ___, updatedAt: ____, _count: _____ } = _b, paperData = __rest(_b, ["id", "questions", "user", "createdAt", "updatedAt", "_count"]);
            return prisma_1.default.questionPaper.create({
                data: Object.assign(Object.assign({}, paperData), { title: options.title || `Copy of ${paperData.title}`, isTemplate: (_a = options.isTemplate) !== null && _a !== void 0 ? _a : false, templateId: originalPaper.isTemplate ? originalPaper.id : originalPaper.templateId, createdBy: userId, status: 'DRAFT', questions: {
                        create: questions.map((q) => {
                            const { id: ___, questionPaperId: ____ } = q, questionData = __rest(q, ["id", "questionPaperId"]);
                            return questionData;
                        }),
                    } }),
                include: {
                    questions: true,
                },
            });
        });
    },
    updateQuestionPaper(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questions } = data, paperData = __rest(data, ["questions"]);
            // We update paper data and if questions are provided, we recreate them (simple approach)
            // A more complex approach would involve syncing questions individually
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const updatedPaper = yield tx.questionPaper.update({
                    where: { id },
                    data: paperData,
                });
                if (questions && Array.isArray(questions)) {
                    yield tx.question.deleteMany({
                        where: { questionPaperId: id },
                    });
                    if (questions.length > 0) {
                        yield tx.question.createMany({
                            data: questions.map((q) => {
                                const { id: _, questionPaperId: __ } = q, questionData = __rest(q, ["id", "questionPaperId"]);
                                return Object.assign(Object.assign({}, questionData), { questionPaperId: id });
                            }),
                        });
                    }
                }
                return tx.questionPaper.findUnique({
                    where: { id },
                    include: { questions: { orderBy: { order: 'asc' } } },
                });
            }));
        });
    },
    deleteQuestionPaper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.questionPaper.delete({
                where: { id },
            });
        });
    },
};
