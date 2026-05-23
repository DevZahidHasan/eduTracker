import api from '@/lib/api';
import { StaffMember, StaffSalary, LeaveRequest, PayrollRecord, StaffAttendance } from '@/types/hr';

export const hrService = {
  getStaff: async () => {
    const response = await api.get<{ data: StaffMember[] }>('/hr/staff');
    return response.data.data;
  },

  updateSalary: async (userId: number, data: Partial<StaffSalary>) => {
    const response = await api.put<{ data: StaffSalary }>(`/hr/staff/${userId}/salary`, data);
    return response.data.data;
  },

  markAttendance: async (date: string, records: { userId: number; status: string; remarks?: string }[]) => {
    const response = await api.post('/hr/attendance', { date, records });
    return response.data.data;
  },

  getAttendance: async (date: string) => {
    const response = await api.get<{ data: StaffAttendance[] }>('/hr/attendance', { params: { date } });
    return response.data.data;
  },

  applyLeave: async (data: { startDate: string; endDate: string; reason: string }) => {
    const response = await api.post<{ data: LeaveRequest }>('/hr/leaves', data);
    return response.data.data;
  },

  getLeaves: async () => {
    const response = await api.get<{ data: LeaveRequest[] }>('/hr/leaves');
    return response.data.data;
  },

  updateLeaveStatus: async (id: number, status: 'APPROVED' | 'REJECTED') => {
    const response = await api.put<{ data: LeaveRequest }>(`/hr/leaves/${id}/status`, { status });
    return response.data.data;
  },

  generatePayroll: async (month: number, year: number) => {
    const response = await api.post<{ data: PayrollRecord[] }>('/hr/payroll/generate', { month, year });
    return response.data.data;
  },

  getPayrollRecords: async (month: number, year: number) => {
    const response = await api.get<{ data: PayrollRecord[] }>('/hr/payroll', { params: { month, year } });
    return response.data.data;
  },

  paySalary: async (id: string, paymentMethod: string) => {
    const response = await api.put<{ data: PayrollRecord }>(`/hr/payroll/${id}/pay`, { paymentMethod });
    return response.data.data;
  },

  downloadSalarySlip: async (id: string) => {
    const response = await api.get(`/hr/payroll/${id}/download`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `salary_slip_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
