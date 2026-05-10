import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { AuditLog } from '@/types/models';
import api from '@/lib/api';

export interface AuditState {
  logs: AuditLog[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AuditState = {
  logs: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchLogs',
  async (params: { entityType?: string; action?: string; performedBy?: number; limit?: number; offset?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get('/audit', { params });
      return response.data.data as { logs: AuditLog[]; total: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.total = action.payload.total;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAuditLogs = (state: RootState) => state.audit.logs;
export const selectAuditTotal = (state: RootState) => state.audit.total;
export const selectAuditLoading = (state: RootState) => state.audit.loading;
export const selectAuditError = (state: RootState) => state.audit.error;

export default auditSlice.reducer;
