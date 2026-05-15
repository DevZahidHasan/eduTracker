import { BankQuestion, BankQuestionFormData } from '@/types/question-bank';
import api from '@/lib/api';

export const questionBankService = {
  async getBankQuestions(filters?: { className?: string; subject?: string; chapter?: string }): Promise<BankQuestion[]> {
    const response = await api.get('/question-bank', { params: filters });
    return response.data.data;
  },

  async getBankQuestion(id: string): Promise<BankQuestion | null> {
    const response = await api.get(`/question-bank/${id}`);
    return response.data.data;
  },

  async createBankQuestion(data: BankQuestionFormData): Promise<BankQuestion> {
    const response = await api.post('/question-bank', data);
    return response.data.data;
  },

  async updateBankQuestion(id: string, data: Partial<BankQuestionFormData>): Promise<BankQuestion> {
    const response = await api.put(`/question-bank/${id}`, data);
    return response.data.data;
  },

  async deleteBankQuestion(id: string): Promise<void> {
    await api.delete(`/question-bank/${id}`);
  }
};
