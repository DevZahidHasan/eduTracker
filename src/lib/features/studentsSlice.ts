import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export interface Student {
  id: string; // The db id or studentId
  studentId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  dateOfBirth?: string;
  enrollmentDate?: string;
}

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
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      const json = await response.json();
      return json.data as Student;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      const json = await response.json();
      return json.data as Student;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStudentThunk = createAsyncThunk(
  'students/deleteStudent',
  async (id: string, { rejectWithValue, getState }) => {
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
    } catch (error: any) {
      return rejectWithValue(error.message);
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
        state.list = action.payload.map((s: any) => ({
          ...s,
          id: s.id.toString(),
        }));
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Student
      .addCase(addStudentThunk.fulfilled, (state, action) => {
        const newStudent = { ...action.payload, id: action.payload.id.toString() };
        state.list.push(newStudent);
      })
      // Update Student
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id.toString());
        if (index !== -1) {
          state.list[index] = { ...action.payload, id: action.payload.id.toString() };
        }
        if (state.selectedStudent?.id === action.payload.id.toString()) {
          state.selectedStudent = { ...action.payload, id: action.payload.id.toString() };
        }
      })
      // Delete Student
      .addCase(deleteStudentThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload.toString());
        if (state.selectedStudent?.id === action.payload.toString()) {
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
