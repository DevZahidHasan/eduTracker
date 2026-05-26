import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

interface LicenseState {
  status: 'VALID' | 'EXPIRED' | 'MISSING' | 'LOADING';
  clientName: string | null;
  type: string | null;
  expiryDate: string | null;
  error: string | null;
}

const initialState: LicenseState = {
  status: 'LOADING',
  clientName: null,
  type: null,
  expiryDate: null,
  error: null,
};

export const fetchLicenseStatus = createAsyncThunk(
  'license/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/license/status');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check license');
    }
  }
);

export const updateLicenseKey = createAsyncThunk(
  'license/updateKey',
  async (licenseKey: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/license/update', { licenseKey });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid license key');
    }
  }
);

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLicenseStatus.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchLicenseStatus.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.clientName = action.payload.clientName || null;
      state.type = action.payload.type || null;
      state.expiryDate = action.payload.expiryDate || null;
      state.error = null;
    });
    builder.addCase(fetchLicenseStatus.rejected, (state, action) => {
      state.status = 'EXPIRED'; // Fallback
      state.error = action.payload as string;
    });

    builder.addCase(updateLicenseKey.fulfilled, (state) => {
      state.error = null;
    });
    builder.addCase(updateLicenseKey.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default licenseSlice.reducer;
