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
}

export interface ParentDashboardData {
  student: ParentDashboardStudent;
  attendanceToday: string;
  unpaidVouchers: UnpaidVoucher[];
  totalDue: number;
  latestResult: LatestResult | null;
}

interface ParentState {
  dashboardData: ParentDashboardData[];
  loading: boolean;
  error: string | null;
}

const initialState: ParentState = {
  dashboardData: [],
  loading: false,
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
      });
  },
});

export const selectParentDashboardData = (state: RootState) => state.parent.dashboardData;
export const selectParentLoading = (state: RootState) => state.parent.loading;

export default parentSlice.reducer;
