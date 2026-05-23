import api from '@/lib/api';
import { Inquiry, CreateInquiryDto, UpdateInquiryDto, AdmitStudentDto } from '@/types/admissions';
import { Student } from '@/types/models';

export const admissionsService = {
  getInquiries: async (params?: { status?: string; source?: string; search?: string }) => {
    const response = await api.get<{ data: Inquiry[] }>('/admissions/inquiries', { params });
    return response.data.data;
  },

  getInquiryById: async (id: number) => {
    const response = await api.get<{ data: Inquiry }>(`/admissions/inquiries/${id}`);
    return response.data.data;
  },

  createInquiry: async (data: CreateInquiryDto) => {
    const response = await api.post<{ data: Inquiry }>('/admissions/inquiries', data);
    return response.data.data;
  },

  updateInquiry: async (id: number, data: UpdateInquiryDto) => {
    const response = await api.put<{ data: Inquiry }>(`/admissions/inquiries/${id}`, data);
    return response.data.data;
  },

  deleteInquiry: async (id: number) => {
    const response = await api.delete(`/admissions/inquiries/${id}`);
    return response.data;
  },

  admitInquiry: async (id: number, data: AdmitStudentDto) => {
    const response = await api.post<{ data: Student }>(`/admissions/inquiries/${id}/admit`, data);
    return response.data.data;
  }
};
