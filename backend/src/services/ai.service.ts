import { Mark, Attendance } from '../types';

export const generatePerformanceInsights = async (marks: Mark[], attendance: Attendance[]): Promise<string> => {
  // Basic mock logic based on data length
  const totalMarks = marks.length;
  const totalAttendance = attendance.length;

  return `AI Analysis Complete: Processed ${totalMarks} mark records and ${totalAttendance} attendance records. The overall performance looks stable, but attention is needed for students with attendance below 80%.`;
};

export interface AIGeneratedQuestion {
  questionType: string;
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export const generateQuestions = async (
  className: string,
  subject: string,
  topic: string,
  difficulty: string,
  count: number = 3
): Promise<AIGeneratedQuestion[]> => {
  // In a production environment, this would call an LLM (OpenAI, Gemini, etc.) 
  // with a prompt to generate structured JSON containing the questions.
  // For this demonstration, we are providing a robust, dynamic mock response.
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

  const mockQuestions: AIGeneratedQuestion[] = [];

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
  } else {
    mockQuestions.push({
      questionType: 'LONG_ANSWER',
      questionText: `Describe the main features of ${topic} and how they are applied in ${subject}.`,
      marks: 4
    });
  }

  return mockQuestions.slice(0, count);
};

