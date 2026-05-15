export interface BankQuestion {
  id: string;
  className: string;
  subject: string;
  chapter?: string;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'LONG_ANSWER' | 'TRUE_FALSE' | 'FILL_IN_BLANKS';
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankQuestionFormData {
  className: string;
  subject: string;
  chapter?: string;
  questionType: string;
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}
