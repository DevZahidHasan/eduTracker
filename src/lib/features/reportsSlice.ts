import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Student, Mark } from '@/types/models';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchStudentReport = createAsyncThunk(
  'reports/fetchStudentReport',
  async ({ studentId, examType }: { studentId: number, examType: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/reports/student?studentId=${studentId}&examType=${examType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch student report');
      const json = await response.json();
      return json.data as StudentReport;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch student report');
    }
  }
);

export const updateRemarks = createAsyncThunk(
  'reports/updateRemarks',
  async ({ studentId, examType, remarks }: { studentId: number, examType: string, remarks: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/reports/remarks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, examType, remarks }),
      });
      if (!response.ok) throw new Error('Failed to update remarks');
      const json = await response.json();
      return json.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update remarks');
    }
  }
);

export const fetchClassPerformance = createAsyncThunk(
  'reports/fetchClassPerformance',
  async ({ className, examType }: { className: string, examType: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/reports/performance?className=${className}&examType=${examType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch class performance');
      const json = await response.json();
      return json.data as ClassPerformance;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch class performance');
    }
  }
);

export const fetchAttendanceSummary = createAsyncThunk(
  'reports/fetchAttendanceSummary',
  async ({ className, startDate, endDate }: { className?: string, startDate?: string, endDate?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      let url = `${API_URL}/reports/attendance?`;
      if (className) url += `className=${className}&`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}&`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch attendance summary');
      const json = await response.json();
      return json.data as AttendanceSummary[];
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch attendance summary');
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
