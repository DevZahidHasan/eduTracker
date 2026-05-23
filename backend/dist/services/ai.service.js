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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = exports.generatePerformanceInsights = void 0;
const generatePerformanceInsights = (marks, attendance) => __awaiter(void 0, void 0, void 0, function* () {
    // Basic mock logic based on data length
    const totalMarks = marks.length;
    const totalAttendance = attendance.length;
    return `AI Analysis Complete: Processed ${totalMarks} mark records and ${totalAttendance} attendance records. The overall performance looks stable, but attention is needed for students with attendance below 80%.`;
});
exports.generatePerformanceInsights = generatePerformanceInsights;
const generateQuestions = (className_1, subject_1, topic_1, difficulty_1, ...args_1) => __awaiter(void 0, [className_1, subject_1, topic_1, difficulty_1, ...args_1], void 0, function* (className, subject, topic, difficulty, count = 3) {
    // In a production environment, this would call an LLM (OpenAI, Gemini, etc.) 
    // with a prompt to generate structured JSON containing the questions.
    // For this demonstration, we are providing a robust, dynamic mock response.
    yield new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
    const mockQuestions = [];
    // Add an MCQ
    mockQuestions.push({
        questionType: 'MULTIPLE_CHOICE',
        questionText: `Which of the following best describes the core concept of ${topic} in ${subject}?`,
        marks: 1,
        options: [
            `A primary element of ${topic}`,
            `A secondary concept`,
            `An unrelated theory`,
            `None of the above`
        ],
        correctAnswer: `A primary element of ${topic}`
    });
    // Add a Short Answer
    mockQuestions.push({
        questionType: 'SHORT_ANSWER',
        questionText: `Briefly explain the significance of ${topic} for Class ${className} students.`,
        marks: 2
    });
    // Add a Long/Creative Answer based on difficulty
    if (difficulty === 'Hard') {
        mockQuestions.push({
            questionType: 'LONG_ANSWER',
            questionText: `Critically analyze the impact of ${topic} within the broader context of ${subject}. Provide examples to support your argument.`,
            marks: 5
        });
    }
    else {
        mockQuestions.push({
            questionType: 'LONG_ANSWER',
            questionText: `Describe the main features of ${topic} and how they are applied in ${subject}.`,
            marks: 4
        });
    }
    return mockQuestions.slice(0, count);
});
exports.generateQuestions = generateQuestions;
