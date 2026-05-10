import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Attendance, AttendanceStatus } from '@/types/models';
import api from '@/lib/api';

export interface AttendanceSummary {
  PRESENT: number;
  ABSENT: number;
  LATE: number;
  EXCUSED: number;
  total: number;
  percentage: number;
}

export interface AttendanceState {
  dailyRecords: Attendance[];
  summary: Record<number, AttendanceSummary>; // Keyed by studentId
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  dailyRecords: [],
  summary: {},
  loading: false,
  error: null,
};

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance');
      return response.data.data as Attendance[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const addDailyRecordsBulkThunk = createAsyncThunk(
  'attendance/addDailyRecordsBulk',
  async (records: Partial<Attendance>[], { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/bulk', { records });
      return response.data.data as Attendance[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save bulk attendance');
    }
  }
);

// Helper function to recalculate summary for a student
const calculateStudentSummary = (records: Attendance[], studentId: number): AttendanceSummary => {
  const studentRecords = records.filter(r => r.studentId === studentId);
  
  const summary = studentRecords.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0, total: 0 } as AttendanceSummary
  );

  const attendedClasses = summary.PRESENT + summary.LATE;
  summary.percentage = summary.total > 0 ? Math.round((attendedClasses / summary.total) * 100) : 0;

  return summary;
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyRecords = action.payload.map((r) => ({
          ...r,
          date: r.date.substring(0, 10), // Formatting date to YYYY-MM-DD
        }));
        
        // Recalculate summaries for all affected students
        const studentIds = new Set(state.dailyRecords.map(r => r.studentId));
        studentIds.forEach(id => {
          state.summary[id] = calculateStudentSummary(state.dailyRecords, id);
        });
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDailyRecordsBulkThunk.fulfilled, (state, action) => {
        action.payload.forEach((r) => {
          const newRecord = {
            ...r,
            date: r.date.substring(0, 10),
          };
          
          const existingIndex = state.dailyRecords.findIndex(
            (rec) => rec.studentId === newRecord.studentId && rec.date === newRecord.date
          );
          if (existingIndex !== -1) {
            state.dailyRecords[existingIndex] = newRecord;
          } else {
            state.dailyRecords.push(newRecord);
          }
        });

        // Recalculate summaries
        const studentIds = new Set<number>(action.payload.map((r) => r.studentId));
        studentIds.forEach(id => {
          state.summary[id] = calculateStudentSummary(state.dailyRecords, id);
        });
      });
  },
});

// Selectors
export const selectAllAttendanceRecords = (state: RootState) => state.attendance.dailyRecords;
export const selectOverallAttendanceRate = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    if (records.length === 0) return 0;
    const presentCount = records.filter(
      (r) => r.status === 'PRESENT' || r.status === 'LATE'
    ).length;
    return Math.round((presentCount / records.length) * 100);
  }
);

export const selectAttendanceBreakdownData = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    records.forEach(r => {
      if (r.status === 'PRESENT') present++;
      if (r.status === 'ABSENT') absent++;
      if (r.status === 'LATE') late++;
      if (r.status === 'EXCUSED') excused++;
    });

    return [
      { name: 'Present', value: present },
      { name: 'Absent', value: absent },
      { name: 'Late', value: late },
      { name: 'Excused', value: excused },
    ].filter(d => d.value > 0);
  }
);

export const selectAttendanceTrendData = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    const attByDate: Record<string, { present: number; total: number }> = {};
    
    records.forEach(r => {
      if (!attByDate[r.date]) {
        attByDate[r.date] = { present: 0, total: 0 };
      }
      if (r.status === 'PRESENT' || r.status === 'LATE') {
        attByDate[r.date].present += 1;
      }
      attByDate[r.date].total += 1;
    });

    return Object.entries(attByDate)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        rate: Math.round((data.present / data.total) * 100),
      }))
      .slice(-10); // Last 10 data points
  }
);

export const selectAttendanceRecordsByDate = (date: string) => (state: RootState) =>
  state.attendance.dailyRecords.filter((record) => record.date === date);
export const selectAttendanceRecordsByStudent = (studentId: number) => (state: RootState) =>
  state.attendance.dailyRecords.filter((record) => record.studentId === studentId);
export const selectAttendanceSummary = (state: RootState) => state.attendance.summary;
export const selectAttendanceSummaryByStudent = (studentId: number) => (state: RootState) => 
  state.attendance.summary[studentId];
export const selectAttendanceLoading = (state: RootState) => state.attendance.loading;
export const selectAttendanceError = (state: RootState) => state.attendance.error;

export default attendanceSlice.reducer;
