export interface Question {
  id: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'LONG_ANSWER' | 'TRUE_FALSE';
  marks: number;
  options?: string[];
  correctAnswer?: string;
  instructions?: string;
  order: number;
}

export interface QuestionPaper {
  id: string;
  title: string;
  className: string;
  section?: string;
  subject: string;
  examType: string;
  examDate: string;
  duration: number;
  totalMarks: number;
  instructions: string;
  questions: Question[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPaperFormData extends Omit<QuestionPaper, 'id' | 'createdAt' | 'updatedAt'> {}
