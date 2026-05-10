import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchConfig = createAsyncThunk(
  'config/fetchConfig',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/config`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch application configuration');
      }
      const json = await response.json();
      return json.data as AppConfig;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addClassThunk = createAsyncThunk(
  'config/addClass',
  async (name: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/config/classes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Failed to add class');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSubjectThunk = createAsyncThunk(
  'config/addSubject',
  async (name: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/config/subjects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Failed to add subject');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addExamTypeThunk = createAsyncThunk(
  'config/addExamType',
  async ({ name, baseMark }: { name: string, baseMark: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/config/exam-types`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify({ name, baseMark })
      });
      if (!response.ok) throw new Error('Failed to add exam type');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExamTypeThunk = createAsyncThunk(
  'config/updateExamType',
  async ({ name, baseMark }: { name: string, baseMark: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/config/exam-types/${name}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify({ baseMark })
      });
      if (!response.ok) throw new Error('Failed to update exam type');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
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
