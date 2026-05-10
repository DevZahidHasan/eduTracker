import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Student, Mark } from '@/types/models';
import api from '@/lib/api';

export interface StudentReport {
  student: Student;
  marks: Mark[];
  gpa: number;
  attendanceRate: number;
  teacherRemarks: string;
  aiInsights: string;
}

export interface ClassPerformance {
  className: string;
  examType: string;
  topStudents: {
    id: number;
    fullName: string;
    rollNumber: string;
    gpa: number;
    totalScore: number;
  }[];
  weakStudents: {
    id: number;
    fullName: string;
    rollNumber: string;
    gpa: number;
    totalScore: number;
  }[];
  classAverageGPA: number;
  totalStudents: number;
}

export interface AttendanceSummary {
  id: number;
  fullName: string;
  rollNumber: string;
  className: string;
  section: string;
  attendanceRate: number;
}

interface ReportsState {
  studentReport: StudentReport | null;
  classPerformance: ClassPerformance | null;
  attendanceSummary: AttendanceSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  studentReport: null,
  classPerformance: null,
  attendanceSummary: [],
  loading: false,
  error: null,
};

export const fetchStudentReport = createAsyncThunk(
  'reports/fetchStudentReport',
  async ({ studentId, examType }: { studentId: number, examType: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/student', { params: { studentId, examType } });
      return response.data.data as StudentReport;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student report');
    }
  }
);

export const updateRemarks = createAsyncThunk(
  'reports/updateRemarks',
  async ({ studentId, examType, remarks }: { studentId: number, examType: string, remarks: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reports/remarks', { studentId, examType, remarks });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update remarks');
    }
  }
);

export const fetchClassPerformance = createAsyncThunk(
  'reports/fetchClassPerformance',
  async ({ className, examType }: { className: string, examType: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/performance', { params: { className, examType } });
      return response.data.data as ClassPerformance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class performance');
    }
  }
);

export const fetchAttendanceSummary = createAsyncThunk(
  'reports/fetchAttendanceSummary',
  async ({ className, startDate, endDate }: { className?: string, startDate?: string, endDate?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports/attendance', { params: { className, startDate, endDate } });
      return response.data.data as AttendanceSummary[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance summary');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearStudentReport: (state) => {
      state.studentReport = null;
    },
    clearAllReports: (state) => {
      state.studentReport = null;
      state.classPerformance = null;
      state.attendanceSummary = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentReport.pending, (state) => { state.loading = true; })
      .addCase(fetchStudentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.studentReport = action.payload;
      })
      .addCase(fetchStudentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClassPerformance.fulfilled, (state, action) => {
        state.classPerformance = action.payload;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.attendanceSummary = action.payload;
      });
  },
});

export const { clearStudentReport, clearAllReports } = reportsSlice.actions;

export const selectStudentReport = (state: RootState) => state.reports.studentReport;
export const selectClassPerformance = (state: RootState) => state.reports.classPerformance;
export const selectAttendanceSummary = (state: RootState) => state.reports.attendanceSummary;
export const selectReportsLoading = (state: RootState) => state.reports.loading;

export default reportsSlice.reducer;
