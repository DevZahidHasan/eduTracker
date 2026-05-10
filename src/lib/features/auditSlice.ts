import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { AuditLog } from '@/types/models';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchLogs',
  async (params: { entityType?: string; action?: string; performedBy?: number; limit?: number; offset?: number } | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.entityType) queryParams.append('entityType', params.entityType);
        if (params.action) queryParams.append('action', params.action);
        if (params.performedBy) queryParams.append('performedBy', params.performedBy.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
      }

      const response = await fetch(`${API_URL}/audit?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      
      const json = await response.json();
      return json.data as { logs: AuditLog[]; total: number };
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch audit logs');
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
