import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export type ExamType = 'CLASS_TEST' | 'MONTHLY_EXAM' | 'MID_TERM' | 'FINAL_EXAM' | 'OTHER';
export type Subject = 'BANGLA' | 'ENGLISH' | 'MATH' | 'SCIENCE' | 'ICT' | 'RELIGION' | 'SOCIAL_SCIENCE';

export interface Mark {
  id: string;
  studentId: string;
  subject: Subject;
  examType: ExamType;
  score: number;
  maxScore: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchMarks = createAsyncThunk(
  'marks/fetchMarks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/marks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch marks');
      }
      const json = await response.json();
      return json.data as Mark[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMarksThunk = createAsyncThunk(
  'marks/addMarks',
  async (mark: Partial<Mark>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/marks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...mark, studentId: Number(mark.studentId) }),
      });
      if (!response.ok) {
        throw new Error('Failed to add mark');
      }
      const json = await response.json();
      return json.data as Mark;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMarksBulkThunk = createAsyncThunk(
  'marks/addMarksBulk',
  async (records: Partial<Mark>[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/marks/bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save bulk marks');
      }

      const json = await response.json();
      return json.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const marksSlice = createSlice({
  name: 'marks',
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<string[]>) => {
      state.subjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.map((m: any) => ({
          ...m,
          id: m.id.toString(),
          studentId: m.studentId.toString(),
          date: m.date.substring(0, 10), // Formatting date to YYYY-MM-DD
        }));
        
        // Extract subjects dynamically
        const subjects = Array.from(new Set(state.data.map((m) => m.subject)));
        state.subjects = subjects;
      })
      .addCase(fetchMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMarksThunk.fulfilled, (state, action) => {
        const newMark = {
          ...action.payload,
          id: action.payload.id.toString(),
          studentId: action.payload.studentId.toString(),
          date: action.payload.date.substring(0, 10),
        };
        
        const existingIndex = state.data.findIndex(
          (m) => m.studentId === newMark.studentId && m.subject === newMark.subject && m.examType === newMark.examType
        );

        if (existingIndex !== -1) {
          state.data[existingIndex] = newMark;
        } else {
          state.data.push(newMark);
        }

        if (!state.subjects.includes(newMark.subject)) {
          state.subjects.push(newMark.subject);
        }
      })
      .addCase(addMarksBulkThunk.fulfilled, (state, action) => {
        action.payload.forEach((m: any) => {
          const newMark = {
            ...m,
            id: m.id.toString(),
            studentId: m.studentId.toString(),
            date: m.date.substring(0, 10),
          };

          const existingIndex = state.data.findIndex(
            (rec) => rec.studentId === newMark.studentId && rec.subject === newMark.subject && rec.examType === newMark.examType
          );

          if (existingIndex !== -1) {
            state.data[existingIndex] = newMark;
          } else {
            state.data.push(newMark);
          }

          if (!state.subjects.includes(newMark.subject)) {
            state.subjects.push(newMark.subject);
          }
        });
      });
  },
});

export const {
  setSubjects,
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
