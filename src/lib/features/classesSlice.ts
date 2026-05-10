import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Student, Routine } from '@/types/models';

export interface ClassOverview {
  className: string;
  totalStudents: number;
  attendancePercentage: number;
  averageMarks: number;
  sections: {
    section: string;
    teacher: string;
    studentCount: number;
  }[];
}

export interface SectionDetail {
  id: number;
  className: string;
  section: string;
  teacherId: number | null;
  teacher: {
    id: number;
    name: string;
    email: string;
  } | null;
  students: Student[];
  routines: Routine[];
}

export interface ClassAnalytics {
  trends: {
    className: string;
    avgScore: number;
    attendanceRate: number;
    studentCount: number;
  }[];
  topClass: string;
  weakestClass: string;
}

interface ClassesState {
  overview: ClassOverview[];
  sectionDetail: SectionDetail | null;
  analytics: ClassAnalytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  overview: [],
  sectionDetail: null,
  analytics: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchClassesOverview = createAsyncThunk(
  'classes/fetchOverview',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/classes/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch classes overview');
      const json = await response.json();
      return json.data as ClassOverview[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSectionDetail = createAsyncThunk(
  'classes/fetchSectionDetail',
  async ({ className, section }: { className: string, section: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/classes/${className}/${section}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch section detail');
      const json = await response.json();
      return json.data as SectionDetail;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClassAnalytics = createAsyncThunk(
  'classes/fetchAnalytics',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/classes/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch class analytics');
      const json = await response.json();
      return json.data as ClassAnalytics;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRoutine = createAsyncThunk(
  'classes/updateRoutine',
  async ({ className, section, routines }: { className: string, section: string, routines: any[] }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/classes/${className}/${section}/routine`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ routines }),
      });
      if (!response.ok) throw new Error('Failed to update routine');
      const json = await response.json();
      return json.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  'classes/updateSection',
  async ({ className, section, teacherId }: { className: string, section: string, teacherId: number | null }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await fetch(`${API_URL}/classes/${className}/${section}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teacherId }),
      });
      if (!response.ok) throw new Error('Failed to update section');
      const json = await response.json();
      return json.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearSectionDetail: (state) => {
      state.sectionDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassesOverview.pending, (state) => { state.loading = true; })
      .addCase(fetchClassesOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchClassesOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSectionDetail.fulfilled, (state, action) => {
        state.sectionDetail = action.payload;
      })
      .addCase(fetchClassAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        if (state.sectionDetail && state.sectionDetail.className === action.payload.className && state.sectionDetail.section === action.payload.section) {
          state.sectionDetail.teacher = action.payload.teacher;
          state.sectionDetail.teacherId = action.payload.teacherId;
        }
      });
  },
});

export const { clearSectionDetail } = classesSlice.actions;

export const selectClassesOverview = (state: RootState) => state.classes.overview;
export const selectSectionDetail = (state: RootState) => state.classes.sectionDetail;
export const selectClassAnalytics = (state: RootState) => state.classes.analytics;
export const selectClassesLoading = (state: RootState) => state.classes.loading;

export default classesSlice.reducer;
