import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import api from '@/lib/api';

export interface Homework {
  id: number;
  className: string;
  section: string;
  subjectName: string;
  teacherId: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  teacher?: {
    name: string;
  };
}

interface HomeworkState {
  homeworks: Homework[];
  parentHomeworks: Homework[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeworkState = {
  homeworks: [],
  parentHomeworks: [],
  loading: false,
  error: null,
};

export const fetchHomeworks = createAsyncThunk(
  'homework/fetchHomeworks',
  async ({ className, section }: { className?: string, section?: string }, { rejectWithValue }) => {
    try {
      let url = '/homework';
      if (className && section) {
        url += `?className=${className}&section=${section}`;
      } else if (className) {
        url += `?className=${className}`;
      }
      const response = await api.get(url);
      return response.data.data as Homework[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch homeworks');
    }
  }
);

export const fetchParentHomeworks = createAsyncThunk(
  'homework/fetchParentHomeworks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/homework/parent');
      return response.data.data as Homework[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parent homeworks');
    }
  }
);

export const createHomeworkThunk = createAsyncThunk(
  'homework/createHomework',
  async (data: Partial<Homework>, { rejectWithValue }) => {
    try {
      const response = await api.post('/homework', data);
      return response.data.data as Homework;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create homework');
    }
  }
);

export const deleteHomeworkThunk = createAsyncThunk(
  'homework/deleteHomework',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/homework/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete homework');
    }
  }
);

export const updateHomeworkThunk = createAsyncThunk(
  'homework/updateHomework',
  async ({ id, data }: { id: number, data: Partial<Homework> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/homework/${id}`, data);
      return response.data.data as Homework;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update homework');
    }
  }
);

const homeworkSlice = createSlice({
  name: 'homework',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeworks.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworks = action.payload;
      })
      .addCase(fetchHomeworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchParentHomeworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentHomeworks.fulfilled, (state, action) => {
        state.loading = false;
        state.parentHomeworks = action.payload;
      })
      .addCase(fetchParentHomeworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createHomeworkThunk.fulfilled, (state, action) => {
        state.homeworks.unshift(action.payload);
      })
      .addCase(updateHomeworkThunk.fulfilled, (state, action) => {
        const index = state.homeworks.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.homeworks[index] = action.payload;
        }
      })
      .addCase(deleteHomeworkThunk.fulfilled, (state, action) => {
        state.homeworks = state.homeworks.filter(h => h.id !== action.payload);
      });
  },
});

export const selectHomeworks = (state: RootState) => state.homework.homeworks;
export const selectParentHomeworks = (state: RootState) => state.homework.parentHomeworks;
export const selectHomeworkLoading = (state: RootState) => state.homework.loading;

export default homeworkSlice.reducer;
