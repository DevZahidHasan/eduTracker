import { createSlice, PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  PRESENT: number;
  ABSENT: number;
  LATE: number;
  EXCUSED: number;
  total: number;
  percentage: number;
}

export interface AttendanceState {
  dailyRecords: AttendanceRecord[];
  summary: Record<string, AttendanceSummary>; // Keyed by studentId
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  dailyRecords: [],
  summary: {},
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const response = await fetch(`${API_URL}/attendance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }
      const json = await response.json();
      return json.data as AttendanceRecord[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDailyRecordsBulkThunk = createAsyncThunk(
  'attendance/addDailyRecordsBulk',
  async (records: Partial<AttendanceRecord>[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const allRecords = state.attendance.dailyRecords as AttendanceRecord[];
      
      const promises = records.map(record => {
        const existingRecord = allRecords.find(r => r.studentId === record.studentId && r.date === record.date);
        if (existingRecord) {
          return fetch(`${API_URL}/attendance/${existingRecord.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...record, studentId: Number(record.studentId) }),
          }).then(res => res.json()).then(json => json.data);
        } else {
          return fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...record, studentId: Number(record.studentId) }),
          }).then(res => res.json()).then(json => json.data);
        }
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to recalculate summary for a student
const calculateStudentSummary = (records: AttendanceRecord[], studentId: string): AttendanceSummary => {
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
        state.dailyRecords = action.payload.map((r: any) => ({
          ...r,
          id: r.id.toString(),
          studentId: r.studentId.toString(),
          date: r.date.substring(0, 10), // Formatting date to YYYY-MM-DD
          status: r.status.toUpperCase() as AttendanceStatus,
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
        action.payload.forEach((r: any) => {
          const newRecord = {
            ...r,
            id: r.id.toString(),
            studentId: r.studentId.toString(),
            date: r.date.substring(0, 10),
            status: r.status.toUpperCase() as AttendanceStatus,
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
        const studentIds = new Set(action.payload.map((r: any) => r.studentId.toString()));
        studentIds.forEach(id => {
          state.summary[id] = calculateStudentSummary(state.dailyRecords, id);
        });
      });
  },
});

// Selectors
export const selectAllAttendanceRecords = (state: { attendance: AttendanceState }) => state.attendance.dailyRecords;
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

export const selectAttendanceRecordsByDate = (date: string) => (state: { attendance: AttendanceState }) =>
  state.attendance.dailyRecords.filter((record) => record.date === date);
export const selectAttendanceRecordsByStudent = (studentId: string) => (state: { attendance: AttendanceState }) =>
  state.attendance.dailyRecords.filter((record) => record.studentId === studentId);
export const selectAttendanceSummary = (state: { attendance: AttendanceState }) => state.attendance.summary;
export const selectAttendanceSummaryByStudent = (studentId: string) => (state: { attendance: AttendanceState }) => 
  state.attendance.summary[studentId];
export const selectAttendanceLoading = (state: { attendance: AttendanceState }) => state.attendance.loading;
export const selectAttendanceError = (state: { attendance: AttendanceState }) => state.attendance.error;

export default attendanceSlice.reducer;
