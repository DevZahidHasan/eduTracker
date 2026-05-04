import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
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

// Helper function to recalculate summary for a student
const calculateStudentSummary = (records: AttendanceRecord[], studentId: string): AttendanceSummary => {
  const studentRecords = records.filter(r => r.studentId === studentId);
  
  const summary = studentRecords.reduce(
    (acc, record) => {
      acc[record.status] += 1;
      acc.total += 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
  );

  // Consider 'late' as present for basic percentage, or adjust as per business logic.
  // For now, percentage = ((present + late) / total) * 100
  const attendedClasses = summary.present + summary.late;
  summary.percentage = summary.total > 0 ? Math.round((attendedClasses / summary.total) * 100) : 0;

  return { ...summary, percentage: summary.percentage };
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAttendanceError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDailyRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.dailyRecords = action.payload;
      
      // Recalculate summaries for all affected students
      const studentIds = new Set(action.payload.map(r => r.studentId));
      studentIds.forEach(id => {
        state.summary[id] = calculateStudentSummary(state.dailyRecords, id);
      });
      
      state.loading = false;
      state.error = null;
    },
    addDailyRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      // Check if record already exists for this student on this date, update if so
      const existingIndex = state.dailyRecords.findIndex(
        r => r.studentId === action.payload.studentId && r.date === action.payload.date
      );
      
      if (existingIndex !== -1) {
        state.dailyRecords[existingIndex] = action.payload;
      } else {
        state.dailyRecords.push(action.payload);
      }

      // Update summary for the student
      state.summary[action.payload.studentId] = calculateStudentSummary(state.dailyRecords, action.payload.studentId);
    },
    addDailyRecordsBulk: (state, action: PayloadAction<AttendanceRecord[]>) => {
      action.payload.forEach(newRecord => {
        const existingIndex = state.dailyRecords.findIndex(
          r => r.studentId === newRecord.studentId && r.date === newRecord.date
        );
        if (existingIndex !== -1) {
          state.dailyRecords[existingIndex] = newRecord;
        } else {
          state.dailyRecords.push(newRecord);
        }
      });

      // Recalculate summaries for affected students
      const studentIds = new Set(action.payload.map(r => r.studentId));
      studentIds.forEach(id => {
        state.summary[id] = calculateStudentSummary(state.dailyRecords, id);
      });
    },
    removeDailyRecord: (state, action: PayloadAction<string>) => {
      const record = state.dailyRecords.find(r => r.id === action.payload);
      if (record) {
        state.dailyRecords = state.dailyRecords.filter(r => r.id !== action.payload);
        state.summary[record.studentId] = calculateStudentSummary(state.dailyRecords, record.studentId);
      }
    },
  },
});

export const {
  setAttendanceLoading,
  setAttendanceError,
  setDailyRecords,
  addDailyRecord,
  addDailyRecordsBulk,
  removeDailyRecord,
} = attendanceSlice.actions;

// Selectors
export const selectAllAttendanceRecords = (state: { attendance: AttendanceState }) => state.attendance.dailyRecords;
export const selectOverallAttendanceRate = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    if (records.length === 0) return 0;
    const presentCount = records.filter(
      (r) => r.status === 'present' || r.status === 'late'
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
      if (r.status === 'present') present++;
      if (r.status === 'absent') absent++;
      if (r.status === 'late') late++;
      if (r.status === 'excused') excused++;
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
      if (r.status === 'present' || r.status === 'late') {
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
