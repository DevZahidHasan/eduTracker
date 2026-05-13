import { QuestionPaper, QuestionPaperFormData } from '@/types/question-paper';
import api from '@/lib/api';

export const questionPaperService = {
  async getQuestionPapers(): Promise<QuestionPaper[]> {
    const response = await api.get('/question-papers');
    return response.data.data;
  },

  async getQuestionPaper(id: string): Promise<QuestionPaper | null> {
    const response = await api.get(`/question-papers/${id}`);
    return response.data.data;
  },

  async createQuestionPaper(data: QuestionPaperFormData): Promise<QuestionPaper> {
    const response = await api.post('/question-papers', data);
    return response.data.data;
  },

  async updateQuestionPaper(id: string, data: Partial<QuestionPaperFormData>): Promise<QuestionPaper> {
    const response = await api.put(`/question-papers/${id}`, data);
    return response.data.data;
  },

  async deleteQuestionPaper(id: string): Promise<void> {
    await api.delete(`/question-papers/${id}`);
  }
};
