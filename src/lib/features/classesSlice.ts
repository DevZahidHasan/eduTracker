import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Student, Routine } from '@/types/models';
import api from '@/lib/api';

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

export const fetchClassesOverview = createAsyncThunk(
  'classes/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/classes/overview');
      return response.data.data as ClassOverview[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes overview');
    }
  }
);

export const fetchSectionDetail = createAsyncThunk(
  'classes/fetchSectionDetail',
  async ({ className, section }: { className: string, section: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/classes/${className}/${section}`);
      return response.data.data as SectionDetail;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch section detail');
    }
  }
);

export const fetchClassAnalytics = createAsyncThunk(
  'classes/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/classes/analytics');
      return response.data.data as ClassAnalytics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class analytics');
    }
  }
);

export const updateRoutine = createAsyncThunk(
  'classes/updateRoutine',
  async ({ className, section, routines }: { className: string, section: string, routines: any[] }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/classes/${className}/${section}/routine`, { routines });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update routine');
    }
  }
);

export const updateSection = createAsyncThunk(
  'classes/updateSection',
  async ({ className, section, teacherId }: { className: string, section: string, teacherId: number | null }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/classes/${className}/${section}`, { teacherId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update section');
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
