import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Student } from '@/types/models';

export interface StudentsState {
  list: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  list: [],
  selectedStudent: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const json = await response.json();
      return json.data as Student[];
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch students');
    }
  }
);

export const addStudentThunk = createAsyncThunk(
  'students/addStudent',
  async (student: Partial<Student>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(student),
      });
      
      const json = await response.json();

      if (!response.ok) {
        return rejectWithValue(json.message || 'Failed to add student');
      }

      return json.data as Student;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add student');
    }
  }
);

export const updateStudentThunk = createAsyncThunk(
  'students/updateStudent',
  async (student: Student, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/students/${student.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(student),
      });
      
      const json = await response.json();

      if (!response.ok) {
        return rejectWithValue(json.message || 'Failed to update student');
      }

      return json.data as Student;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update student');
    }
  }
);

export const deleteStudentThunk = createAsyncThunk(
  'students/deleteStudent',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      return id;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete student');
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
      // Update Student
      .addCase(updateStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })
      .addCase(updateStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Student
      .addCase(deleteStudentThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
        if (state.selectedStudent?.id === action.payload) {
          state.selectedStudent = null;
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
