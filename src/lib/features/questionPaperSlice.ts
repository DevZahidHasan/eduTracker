import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { QuestionPaper, QuestionPaperFormData } from '@/types/question-paper';
import { questionPaperService } from '@/services/question-paper.service';

interface RootStateAny {
  questionPaper: QuestionPaperState;
  [key: string]: any;
}

interface QuestionPaperState {
  papers: QuestionPaper[];
  currentPaper: QuestionPaper | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionPaperState = {
  papers: [],
  currentPaper: null,
  loading: false,
  error: null,
};

export const fetchQuestionPapers = createAsyncThunk(
  'questionPaper/fetchAll',
  async (filters: { isTemplate?: boolean; className?: string; subject?: string } = {}, { rejectWithValue }) => {
    try {
      return await questionPaperService.getQuestionPapers(filters);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch papers');
    }
  }
);

export const duplicateQuestionPaper = createAsyncThunk(
  'questionPaper/duplicate',
  async ({ id, options }: { id: string, options: { isTemplate?: boolean; title?: string } }, { rejectWithValue }) => {
    try {
      return await questionPaperService.duplicateQuestionPaper(id, options);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to duplicate paper');
    }
  }
);

export const fetchQuestionPaperById = createAsyncThunk(
  'questionPaper/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const paper = await questionPaperService.getQuestionPaper(id);
      if (!paper) throw new Error('Paper not found');
      return paper;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch paper');
    }
  }
);

export const createQuestionPaper = createAsyncThunk(
  'questionPaper/create',
  async (data: QuestionPaperFormData, { rejectWithValue }) => {
    try {
      return await questionPaperService.createQuestionPaper(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create paper');
    }
  }
);

export const updateQuestionPaper = createAsyncThunk(
  'questionPaper/update',
  async ({ id, data }: { id: string, data: Partial<QuestionPaperFormData> }, { rejectWithValue }) => {
    try {
      return await questionPaperService.updateQuestionPaper(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update paper');
    }
  }
);

export const deleteQuestionPaper = createAsyncThunk(
  'questionPaper/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await questionPaperService.deleteQuestionPaper(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete paper');
    }
  }
);

const questionPaperSlice = createSlice({
  name: 'questionPaper',
  initialState,
  reducers: {
    clearCurrentPaper(state) {
      state.currentPaper = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.papers = action.payload;
      })
      .addCase(fetchQuestionPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuestionPaperById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionPaperById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPaper = action.payload;
      })
      .addCase(fetchQuestionPaperById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentPaper } = questionPaperSlice.actions;

export const selectAllQuestionPapers = (state: RootStateAny) => state.questionPaper.papers;
export const selectCurrentQuestionPaper = (state: RootStateAny) => state.questionPaper.currentPaper;
export const selectQuestionPaperLoading = (state: RootStateAny) => state.questionPaper.loading;

export default questionPaperSlice.reducer;
