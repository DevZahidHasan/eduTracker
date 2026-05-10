import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import api from '@/lib/api';

export interface ConfigOption {
  value: string;
  label: string;
}

export interface ExamTypeOption extends ConfigOption {
  baseMark: number;
}

export interface AppConfig {
  classes: ConfigOption[];
  subjects: ConfigOption[];
  examTypes: ExamTypeOption[];
  teachers: ConfigOption[];
}

export interface ConfigState {
  data: AppConfig;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  genders: ConfigOption[];
}

const initialState: ConfigState = {
  data: {
    classes: [],
    subjects: [],
    examTypes: [],
    teachers: [],
  },
  loading: false,
  error: null,
  initialized: false,
  genders: [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ],
};

export const fetchConfig = createAsyncThunk(
  'config/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/config');
      return response.data.data as AppConfig;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch configuration');
    }
  }
);

export const addClassThunk = createAsyncThunk(
  'config/addClass',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/config/classes', { name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add class');
    }
  }
);

export const addSubjectThunk = createAsyncThunk(
  'config/addSubject',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/config/subjects', { name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add subject');
    }
  }
);

export const addExamTypeThunk = createAsyncThunk(
  'config/addExamType',
  async ({ name, baseMark }: { name: string, baseMark: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/config/exam-types', { name, baseMark });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add exam type');
    }
  }
);

export const updateExamTypeThunk = createAsyncThunk(
  'config/updateExamType',
  async ({ name, baseMark }: { name: string, baseMark: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/config/exam-types/${name}`, { baseMark });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update exam type');
    }
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.initialized = true;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectConfig = (state: RootState) => state.config.data;
export const selectClasses = (state: RootState) => state.config.data.classes;
export const selectSubjects = (state: RootState) => state.config.data.subjects;
export const selectExamTypes = (state: RootState) => state.config.data.examTypes;
export const selectTeachers = (state: RootState) => state.config.data.teachers;
export const selectGenders = (state: RootState) => state.config.genders;
export const selectConfigInitialized = (state: RootState) => state.config.initialized;

export default configSlice.reducer;
