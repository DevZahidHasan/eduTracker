import api from '@/lib/api';
import { Template, GenerateIDCardsDto, GenerateCertificateDto } from '@/types/documents';

export const documentService = {
  getTemplates: async () => {
    const response = await api.get<{ data: Template[] }>('/documents/templates');
    return response.data.data;
  },

  createTemplate: async (data: Partial<Template>) => {
    const response = await api.post<{ data: Template }>('/documents/templates', data);
    return response.data.data;
  },

  updateTemplate: async (id: number, data: Partial<Template>) => {
    const response = await api.put<{ data: Template }>(`/documents/templates/${id}`, data);
    return response.data.data;
  },

  deleteTemplate: async (id: number) => {
    const response = await api.delete(`/documents/templates/${id}`);
    return response.data;
  },

  generateIDCards: async (data: GenerateIDCardsDto) => {
    const response = await api.post('/documents/generate/id-cards', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateCertificate: async (data: GenerateCertificateDto) => {
    const response = await api.post('/documents/generate/certificate', data, {
      responseType: 'blob',
    });
    return response.data;
  }
};
