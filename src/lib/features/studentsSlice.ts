import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Student } from '@/types/models';
import api from '@/lib/api';

export interface StudentsState {
  list: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
  // For optimistic rollbacks
  previousList: Student[] | null;
}

const initialState: StudentsState = {
  list: [],
  selectedStudent: null,
  loading: false,
  error: null,
  previousList: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/students');
      return response.data.data as Student[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const addStudentThunk = createAsyncThunk(
  'students/addStudent',
  async (student: Partial<Student>, { rejectWithValue }) => {
    try {
      const response = await api.post('/students', student);
      return response.data.data as Student;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add student');
    }
  }
);

export const updateStudentThunk = createAsyncThunk(
  'students/updateStudent',
  async (student: Student, { rejectWithValue }) => {
    try {
      const response = await api.put(`/students/${student.id}`, student);
      return response.data.data as Student;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

export const deleteStudentThunk = createAsyncThunk(
  'students/deleteStudent',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/students/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

export const linkParentThunk = createAsyncThunk(
  'students/linkParent',
  async ({ studentId, parentEmail }: { studentId: number, parentEmail: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/students/${studentId}/link-parent`, { parentEmail });
      return response.data.data as Student;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to link parent');
    }
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Student
      .addCase(addStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Student (Optimistic)
      .addCase(updateStudentThunk.pending, (state, action) => {
        state.previousList = [...state.list];
        const index = state.list.findIndex((s) => s.id === action.meta.arg.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.meta.arg };
        }
      })
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.previousList = null;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (state.previousList) {
          state.list = state.previousList;
          state.previousList = null;
        }
      })
      // Delete Student (Optimistic)
      .addCase(deleteStudentThunk.pending, (state, action) => {
        state.previousList = [...state.list];
        state.list = state.list.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(deleteStudentThunk.fulfilled, (state) => {
        state.previousList = null;
      })
      .addCase(deleteStudentThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        if (state.previousList) {
          state.list = state.previousList;
          state.previousList = null;
        }
      })
      // Link Parent
      .addCase(linkParentThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const {
  setSelectedStudent,
} = studentsSlice.actions;

// Selectors
export const selectAllStudents = (state: { students: StudentsState }) => state.students.list;
export const selectTotalStudents = createSelector(
  [selectAllStudents],
  (students) => students.length
);
export const selectSelectedStudent = (state: { students: StudentsState }) => state.students.selectedStudent;
export const selectStudentsLoading = (state: { students: StudentsState }) => state.students.loading;
export const selectStudentsError = (state: { students: StudentsState }) => state.students.error;

export default studentsSlice.reducer;
