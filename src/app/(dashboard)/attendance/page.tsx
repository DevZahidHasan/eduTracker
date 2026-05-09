"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Save, CheckCircle, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { 
  selectAllAttendanceRecords, 
  addDailyRecordsBulkThunk,
  fetchAttendance,
  AttendanceRecord,
  AttendanceStatus
} from '@/lib/features/attendanceSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AttendancePage() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectAllStudents);
  
  const loadingAttendance = useAppSelector((state) => state.attendance.loading);
  const errorAttendance = useAppSelector((state) => state.attendance.error);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAttendance());
  }, [dispatch]);

  // Get records from Redux for the currently selected date
  const allRecords = useAppSelector(selectAllAttendanceRecords);
  const storeRecords = React.useMemo(() => 
    allRecords.filter(record => record.date === selectedDate), 
  [allRecords, selectedDate]);

  // Local state to manage toggles before saving
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Sync local attendance state when selectedDate or storeRecords change
  useEffect(() => {
    const attendanceMap: Record<string, AttendanceStatus> = {};
    storeRecords.forEach(record => {
      attendanceMap[record.studentId] = record.status;
    });
    setLocalAttendance(attendanceMap);
    setIsDirty(false);
  }, [storeRecords, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsDirty(true);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      newMap[student.id] = status;
    });
    setLocalAttendance(newMap);
    setIsDirty(true);
  };

  const handleSave = () => {
    const recordsToSave: Partial<AttendanceRecord>[] = students.map(student => {
      const existingRecord = storeRecords.find(r => r.studentId === student.id);
      return {
        id: existingRecord?.id, // Let backend assign id if new
        studentId: student.id,
        date: selectedDate,
        status: localAttendance[student.id] || 'ABSENT', // Default to absent if untouched
      };
    });

    dispatch(addDailyRecordsBulkThunk(recordsToSave));
    setIsDirty(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-neon text-glow">Attendance</h1>
          <p className="text-gray-400">Track daily student attendance.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 border border-cyan-800 p-2 rounded-xl">
          <CalendarIcon className="text-cyan-500 ml-2" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white border-none focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class List</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleMarkAll('PRESENT')}>
              Mark All Present
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleMarkAll('ABSENT')}>
              Mark All Absent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {errorAttendance && <div className="text-red-500 mb-4">{errorAttendance}</div>}
          {loadingAttendance ? (
            <div className="text-center py-12 text-gray-500">Loading attendance data...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl">
              No students found. Add students first to take attendance.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-cyan-800/50 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cyan-950/30 text-cyan-400 border-b border-cyan-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Student Name</th>
                      <th className="px-6 py-4 font-medium">Student ID</th>
                      <th className="px-6 py-4 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-800/30">
                    {students.map((student) => {
                      const currentStatus = localAttendance[student.id];
                      
                      return (
                        <tr key={student.id} className="hover:bg-cyan-900/10 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{`${student.firstName} ${student.lastName}`}</td>
                          <td className="px-6 py-4 text-gray-400">{student.studentId}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                                  currentStatus === 'PRESENT'
                                    ? 'bg-green-500/20 border-green-500 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                                    : 'border-gray-800 text-gray-500 hover:border-gray-600'
                                }`}
                              >
                                <CheckCircle size={16} />
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                                  currentStatus === 'ABSENT'
                                    ? 'bg-red-500/20 border-red-500 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                    : 'border-gray-800 text-gray-500 hover:border-gray-600'
                                }`}
                              >
                                <XCircle size={16} />
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty}
                  className="flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Attendance
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
