import { QuestionPaper, QuestionPaperFormData } from '@/types/question-paper';
import api from '@/lib/api';

export const questionPaperService = {
  async getQuestionPapers(filters: { isTemplate?: boolean; className?: string; subject?: string } = {}): Promise<QuestionPaper[]> {
    const params = new URLSearchParams();
    if (filters.isTemplate !== undefined) params.append('isTemplate', String(filters.isTemplate));
    if (filters.className) params.append('className', filters.className);
    if (filters.subject) params.append('subject', filters.subject);

    const response = await api.get(`/question-papers?${params.toString()}`);
    return response.data.data;
  },

  async getTemplates(): Promise<QuestionPaper[]> {
    const response = await api.get('/question-papers/templates');
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

  async duplicateQuestionPaper(id: string, options: { isTemplate?: boolean; title?: string } = {}): Promise<QuestionPaper> {
    const response = await api.post(`/question-papers/${id}/duplicate`, options);
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
