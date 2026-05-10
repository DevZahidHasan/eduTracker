import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import api from '@/lib/api';

export interface AiInsightsState {
  result: any;
  loading: boolean;
  error: string | null;
}

const initialState: AiInsightsState = {
  result: null,
  loading: false,
  error: null,
};

export const generateInsights = createAsyncThunk(
  'aiInsights/generateInsights',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai-insights', payload);
      return response.data.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate insights');
    }
  }
);

const aiInsightsSlice = createSlice({
  name: 'aiInsights',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResult } = aiInsightsSlice.actions;

export default aiInsightsSlice.reducer;
