import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Insight {
  id: string;
  studentId?: string; // Optional: if insight is specific to a student
  type: 'performance' | 'attendance' | 'general' | 'behavior';
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface AiInsightsState {
  insights: Insight[];
  loading: boolean;
  error: string | null;
}

const initialState: AiInsightsState = {
  insights: [],
  loading: false,
  error: null,
};

const aiInsightsSlice = createSlice({
  name: 'aiInsights',
  initialState,
  reducers: {
    setInsightsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInsights: (state, action: PayloadAction<Insight[]>) => {
      state.insights = action.payload;
      state.loading = false;
      state.error = null;
    },
    setInsightsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addInsight: (state, action: PayloadAction<Insight>) => {
      state.insights.push(action.payload);
    },
    removeInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter((i) => i.id !== action.payload);
    },
    clearInsights: (state) => {
      state.insights = [];
    },
  },
});

export const {
  setInsightsLoading,
  setInsights,
  setInsightsError,
  addInsight,
  removeInsight,
  clearInsights,
} = aiInsightsSlice.actions;
export default aiInsightsSlice.reducer;
