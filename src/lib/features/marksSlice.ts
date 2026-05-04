import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export interface Mark {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface MarksState {
  data: Mark[];
  subjects: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MarksState = {
  data: [],
  subjects: [],
  loading: false,
  error: null,
};

const marksSlice = createSlice({
  name: 'marks',
  initialState,
  reducers: {
    setMarksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMarksError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSubjects: (state, action: PayloadAction<string[]>) => {
      state.subjects = action.payload;
    },
    setMarksData: (state, action: PayloadAction<Mark[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMarks: (state, action: PayloadAction<Mark | Mark[]>) => {
      if (Array.isArray(action.payload)) {
        state.data.push(...action.payload);
      } else {
        state.data.push(action.payload);
      }
    },
    updateMarks: (state, action: PayloadAction<Mark>) => {
      const index = state.data.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
});

export const {
  setMarksLoading,
  setMarksError,
  setSubjects,
  setMarksData,
  addMarks,
  updateMarks,
} = marksSlice.actions;

// Selectors
export const selectAllMarks = (state: { marks: MarksState }) => state.marks.data;
export const selectAverageMarks = createSelector(
  [selectAllMarks],
  (marks) => {
    if (marks.length === 0) return 0;
    const totalPercentage = marks.reduce((sum, m) => sum + (m.score / m.maxScore), 0);
    return Math.round((totalPercentage / marks.length) * 100);
  }
);

export const selectMarksTrendData = createSelector(
  [selectAllMarks],
  (marks) => {
    const marksByDate: Record<string, { total: number; count: number }> = {};
    
    marks.forEach(m => {
      if (!marksByDate[m.date]) {
        marksByDate[m.date] = { total: 0, count: 0 };
      }
      marksByDate[m.date].total += (m.score / m.maxScore) * 100;
      marksByDate[m.date].count += 1;
    });

    return Object.entries(marksByDate)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        average: Math.round(data.total / data.count),
      }))
      .slice(-10); // Last 10 data points
  }
);

export const selectMarksByStudentId = (studentId: string) => (state: { marks: MarksState }) =>
  state.marks.data.filter((mark) => mark.studentId === studentId);
export const selectSubjects = (state: { marks: MarksState }) => state.marks.subjects;
export const selectMarksLoading = (state: { marks: MarksState }) => state.marks.loading;
export const selectMarksError = (state: { marks: MarksState }) => state.marks.error;

export default marksSlice.reducer;
