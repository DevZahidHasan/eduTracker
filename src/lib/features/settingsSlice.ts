import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SchoolProfile, SystemSettings, User } from '@/types/models';
import api from '@/lib/api';

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

export const fetchSchoolProfile = createAsyncThunk(
  'settings/fetchSchoolProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/profile');
      return response.data.data as SchoolProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateSchoolProfileThunk = createAsyncThunk(
  'settings/updateSchoolProfile',
  async (profile: Partial<SchoolProfile>, { rejectWithValue }) => {
    try {
      const response = await api.post('/settings/profile', profile);
      return response.data.data as SchoolProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchSystemSettings = createAsyncThunk(
  'settings/fetchSystemSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/system');
      return response.data.data as SystemSettings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSystemSettingsThunk = createAsyncThunk(
  'settings/updateSystemSettings',
  async (settings: SystemSettings, { rejectWithValue }) => {
    try {
      await api.post('/settings/system', { settings });
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'settings/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings/users');
      return response.data.data as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'settings/updateUser',
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.put(`/settings/users/${user.id}`, user);
      return response.data.data as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'settings/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/settings/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const triggerEndOfDayThunk = createAsyncThunk(
  'settings/triggerEndOfDay',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/settings/end-of-day');
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to trigger end of day');
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
