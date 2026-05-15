import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface FinanceState {
  feeTypes: any[];
  feeStructures: any[];
  vouchers: any[];
  studentVouchers: any[];
  stats: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  feeTypes: [],
  feeStructures: [],
  vouchers: [],
  studentVouchers: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchFeeTypes = createAsyncThunk('finance/fetchFeeTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/finance/fee-types');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee types');
  }
});

export const createFeeType = createAsyncThunk('finance/createFeeType', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/finance/fee-types', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create fee type');
  }
});

export const fetchFeeStructures = createAsyncThunk('finance/fetchFeeStructures', async (className: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/finance/fee-structures?className=${className}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch fee structures');
  }
});

export const upsertFeeStructure = createAsyncThunk('finance/upsertFeeStructure', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/finance/fee-structures', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update fee structure');
  }
});

export const generateVouchers = createAsyncThunk('finance/generateVouchers', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/finance/vouchers/generate', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to generate vouchers');
  }
});

export const fetchAllVouchers = createAsyncThunk('finance/fetchAllVouchers', async (filters: any = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters.className) params.append('className', filters.className);
    if (filters.status) params.append('status', filters.status);
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    
    const response = await api.get(`/finance/vouchers?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vouchers');
  }
});

export const deleteVoucher = createAsyncThunk('finance/deleteVoucher', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/finance/vouchers/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete voucher');
  }
});

export const fetchStudentVouchers = createAsyncThunk('finance/fetchStudentVouchers', async (studentId: number, { rejectWithValue }) => {
  try {
    const response = await api.get(`/finance/vouchers/student/${studentId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch student vouchers');
  }
});

export const collectPayment = createAsyncThunk('finance/collectPayment', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/finance/payments/collect', data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to collect payment');
  }
});

export const fetchFinanceStats = createAsyncThunk('finance/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/finance/stats');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    clearFinanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeTypes.pending, (state) => { state.loading = true; })
      .addCase(fetchFeeTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.feeTypes = action.payload;
      })
      .addCase(fetchFeeTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeeStructures.fulfilled, (state, action) => {
        state.feeStructures = action.payload;
      })
      .addCase(fetchAllVouchers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchStudentVouchers.fulfilled, (state, action) => {
        state.studentVouchers = action.payload;
      })
      .addCase(fetchFinanceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearFinanceError } = financeSlice.actions;
export const selectFeeTypes = (state: any) => state.finance.feeTypes;
export const selectFeeStructures = (state: any) => state.finance.feeStructures;
export const selectVouchers = (state: any) => state.finance.vouchers;
export const selectStudentVouchers = (state: any) => state.finance.studentVouchers;
export const selectFinanceStats = (state: any) => state.finance.stats;
export const selectFinanceLoading = (state: any) => state.finance.loading;

export default financeSlice.reducer;
