import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export interface Student {
  id: string;
  name: string;
  grade: string;
  email: string;
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

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudentsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setStudentsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.list.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.list.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.selectedStudent?.id === action.payload.id) {
        state.selectedStudent = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((s) => s.id !== action.payload);
      if (state.selectedStudent?.id === action.payload) {
        state.selectedStudent = null;
      }
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
  },
});

export const {
  setStudentsLoading,
  setStudents,
  setStudentsError,
  addStudent,
  updateStudent,
  deleteStudent,
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
