import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import api from '@/lib/api';

export interface ParentDashboardStudent {
  id: number;
  studentId: string;
  fullName: string;
  className: string;
  section: string;
  rollNumber: string;
  profileImage: string | null;
}

export interface UnpaidVoucher {
  id: string;
  month: number;
  year: number;
  totalAmount: number;
  dueDate: string;
}

export interface LatestResult {
  examType: string;
  percentage: number;
  grade: string | null;
  status: string;
  marks?: {
    subject: string;
    score: number;
    maxScore: number;
  }[];
}

export interface ParentDashboardData {
  student: ParentDashboardStudent;
  attendanceToday: string;
  unpaidVouchers: UnpaidVoucher[];
  totalDue: number;
  latestResult: LatestResult | null;
}

export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

interface ParentState {
  dashboardData: ParentDashboardData[];
  resultsData: any[];
  attendanceData: AttendanceRecord[];
  feesData: any[];
  loading: boolean;
  resultsLoading: boolean;
  attendanceLoading: boolean;
  feesLoading: boolean;
  error: string | null;
}

const initialState: ParentState = {
  dashboardData: [],
  resultsData: [],
  attendanceData: [],
  feesData: [],
  loading: false,
  resultsLoading: false,
  attendanceLoading: false,
  feesLoading: false,
  error: null,
};

export const fetchParentDashboard = createAsyncThunk(
  'parent/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/parent/dashboard');
      return response.data.data as ParentDashboardData[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parent dashboard');
    }
  }
);

export const fetchParentResults = createAsyncThunk(
  'parent/fetchResults',
  async ({ studentId, examType }: { studentId: number, examType?: string }, { rejectWithValue }) => {
    try {
      const url = examType ? `/parent/results/${studentId}?examType=${examType}` : `/parent/results/${studentId}`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch results');
    }
  }
);

export const fetchParentAttendance = createAsyncThunk(
  'parent/fetchAttendance',
  async ({ studentId, startDate, endDate }: { studentId: number; startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      let url = `/parent/attendance/${studentId}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await api.get(url);
      return response.data.data as AttendanceRecord[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const fetchParentFees = createAsyncThunk(
  'parent/fetchFees',
  async ({ studentId }: { studentId: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/parent/fees/${studentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fees');
    }
  }
);

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchParentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchParentResults.pending, (state) => {
        state.resultsLoading = true;
        state.error = null;
      })
      .addCase(fetchParentResults.fulfilled, (state, action) => {
        state.resultsLoading = false;
        state.resultsData = action.payload;
      })
      .addCase(fetchParentResults.rejected, (state, action) => {
        state.resultsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchParentAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.error = null;
      })
      .addCase(fetchParentAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchParentAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchParentFees.pending, (state) => {
        state.feesLoading = true;
        state.error = null;
      })
      .addCase(fetchParentFees.fulfilled, (state, action) => {
        state.feesLoading = false;
        state.feesData = action.payload;
      })
      .addCase(fetchParentFees.rejected, (state, action) => {
        state.feesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectParentDashboardData = (state: RootState) => state.parent.dashboardData;
export const selectParentResultsData = (state: RootState) => state.parent.resultsData;
export const selectParentResultsLoading = (state: RootState) => state.parent.resultsLoading;
export const selectParentAttendanceData = (state: RootState) => state.parent.attendanceData;
export const selectParentAttendanceLoading = (state: RootState) => state.parent.attendanceLoading;
export const selectParentFeesData = (state: RootState) => state.parent.feesData;
export const selectParentFeesLoading = (state: RootState) => state.parent.feesLoading;
export const selectParentLoading = (state: RootState) => state.parent.loading;

export default parentSlice.reducer;
