import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const generateInsights = createAsyncThunk(
  'aiInsights/generateInsights',
  async (payload: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await fetch(`${API_URL}/ai-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const json = await response.json();
      return json.data.result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate insights');
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
