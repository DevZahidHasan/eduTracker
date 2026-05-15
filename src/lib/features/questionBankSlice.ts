import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BankQuestion, BankQuestionFormData } from '@/types/question-bank';
import { questionBankService } from '@/services/question-bank.service';

interface RootStateAny {
  questionBank: QuestionBankState;
  [key: string]: any;
}

interface QuestionBankState {
  questions: BankQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionBankState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchBankQuestions = createAsyncThunk(
  'questionBank/fetchAll',
  async (filters: { className?: string; subject?: string; chapter?: string } | undefined, { rejectWithValue }) => {
    try {
      return await questionBankService.getBankQuestions(filters);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch bank questions');
    }
  }
);

export const createBankQuestion = createAsyncThunk(
  'questionBank/create',
  async (data: BankQuestionFormData, { rejectWithValue }) => {
    try {
      return await questionBankService.createBankQuestion(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create question');
    }
  }
);

export const updateBankQuestion = createAsyncThunk(
  'questionBank/update',
  async ({ id, data }: { id: string, data: Partial<BankQuestionFormData> }, { rejectWithValue }) => {
    try {
      return await questionBankService.updateBankQuestion(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update question');
    }
  }
);

export const deleteBankQuestion = createAsyncThunk(
  'questionBank/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await questionBankService.deleteBankQuestion(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete question');
    }
  }
);

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchBankQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAllBankQuestions = (state: RootStateAny) => state.questionBank.questions;
export const selectQuestionBankLoading = (state: RootStateAny) => state.questionBank.loading;

export default questionBankSlice.reducer;
