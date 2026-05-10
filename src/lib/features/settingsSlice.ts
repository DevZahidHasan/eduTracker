import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SchoolProfile, SystemSettings, User } from '@/types/models';

export interface SettingsState {
  schoolProfile: SchoolProfile | null;
  systemSettings: SystemSettings;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  schoolProfile: null,
  systemSettings: {
    theme: 'light',
    compactMode: 'false',
    accentColor: '#2563eb',
    attendanceAlerts: 'true',
    marksAlerts: 'true',
    parentNotifications: 'false',
    sessionTimeout: '60'
  },
  users: [],
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchSchoolProfile = createAsyncThunk(
  'settings/fetchSchoolProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/profile`, {
        headers: { 'Authorization': `Bearer ${state.auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const json = await response.json();
      return json.data as SchoolProfile;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

export const updateSchoolProfileThunk = createAsyncThunk(
  'settings/updateSchoolProfile',
  async (profile: Partial<SchoolProfile>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify(profile)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const json = await response.json();
      return json.data as SchoolProfile;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

export const fetchSystemSettings = createAsyncThunk(
  'settings/fetchSystemSettings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/system`, {
        headers: { 'Authorization': `Bearer ${state.auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      const json = await response.json();
      return json.data as SystemSettings;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

export const updateSystemSettingsThunk = createAsyncThunk(
  'settings/updateSystemSettings',
  async (settings: SystemSettings, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/system`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.auth.token}` 
        },
        body: JSON.stringify({ settings })
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return settings;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'settings/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/users`, {
        headers: { 'Authorization': `Bearer ${state.auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const json = await response.json();
      return json.data as User[];
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

export const triggerEndOfDayThunk = createAsyncThunk(
  'settings/triggerEndOfDay',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await fetch(`${API_URL}/settings/end-of-day`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${state.auth.token}` }
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || 'Failed to trigger end of day');
      return json.message;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
        state.schoolProfile = action.payload;
      })
      .addCase(updateSchoolProfileThunk.fulfilled, (state, action) => {
        state.schoolProfile = action.payload;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        // Merge with initial defaults
        state.systemSettings = { ...state.systemSettings, ...action.payload };
      })
      .addCase(updateSystemSettingsThunk.fulfilled, (state, action) => {
        state.systemSettings = { ...state.systemSettings, ...action.payload };
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const selectSchoolProfile = (state: RootState) => state.settings.schoolProfile;
export const selectSystemSettings = (state: RootState) => state.settings.systemSettings;
export const selectUsers = (state: RootState) => state.settings.users;
export const selectSettingsLoading = (state: RootState) => state.settings.loading;

export default settingsSlice.reducer;
