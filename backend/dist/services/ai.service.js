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
exports.generatePerformanceInsights = void 0;
const generatePerformanceInsights = (marks, attendance) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real application, you would pass this data to an LLM or an AI API.
    // Example: using fetch to call OpenAI or Gemini API.
    // Basic mock logic based on data length
    const totalMarks = marks.length;
    const totalAttendance = attendance.length;
    return `AI Analysis Complete: Processed ${totalMarks} mark records and ${totalAttendance} attendance records. The overall performance looks stable, but attention is needed for students with attendance below 80%.`;
});
exports.generatePerformanceInsights = generatePerformanceInsights;
