"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Save, CheckCircle, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
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
import { selectClasses } from '@/lib/features/configSlice';

export default function AttendancePage() {
  const dispatch = useAppDispatch();
  const allStudents = useAppSelector(selectAllStudents);
  const CLASSES = useAppSelector(selectClasses);
  
  const loadingAttendance = useAppSelector((state) => state.attendance.loading);
  const errorAttendance = useAppSelector((state) => state.attendance.error);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAttendance());
  }, [dispatch]);

  // Filter students based on selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return allStudents.filter(student => student.className === selectedClass);
  }, [allStudents, selectedClass]);

  // Get records from Redux for the currently selected date
  const allRecords = useAppSelector(selectAllAttendanceRecords);
  const storeRecords = useMemo(() => 
    allRecords.filter(record => record.date === selectedDate), 
  [allRecords, selectedDate]);

  // Local state to manage toggles before saving
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Sync local attendance state when selectedDate, storeRecords, or classStudents change
  useEffect(() => {
    const attendanceMap: Record<string, AttendanceStatus> = {};
    
    // Only map records for students currently in the filtered class
    classStudents.forEach(student => {
      const record = storeRecords.find(r => r.studentId === student.id);
      if (record) {
        attendanceMap[student.id] = record.status;
      }
    });

    setLocalAttendance(attendanceMap);
    setIsDirty(false);
  }, [storeRecords, selectedDate, classStudents]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsDirty(true);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach(student => {
      newMap[student.id] = status;
    });
    setLocalAttendance(newMap);
    setIsDirty(true);
  };

  const handleSave = () => {
    const recordsToSave: Partial<AttendanceRecord>[] = classStudents.map(student => {
      const existingRecord = storeRecords.find(r => r.studentId === student.id);
      return {
        id: existingRecord?.id, // Let backend assign id if new
        studentId: student.id,
        date: selectedDate,
        status: localAttendance[student.id] || 'ABSENT', // Default to absent if untouched
      };
    });

    dispatch(addDailyRecordsBulkThunk(recordsToSave))
      .unwrap()
      .then(() => toast.success('Attendance saved successfully'))
      .catch((err) => toast.error(err || 'Failed to save attendance'));
    setIsDirty(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-neon text-glow flex items-center gap-3">
            <Users className="text-cyan-400" size={32} />
            Class Attendance
          </h1>
          <p className="text-gray-400">Manage and track daily student attendance by class.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Class Selector */}
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300"
            >
              <option value="" disabled>Choose a class...</option>
              {CLASSES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Date</label>
            <div className="flex items-center gap-2 bg-black/40 border border-cyan-800/50 px-4 py-2.5 rounded-xl focus-within:border-cyan-500 transition-all duration-300 w-full">
              <CalendarIcon className="text-cyan-500" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white border-none focus:outline-none cursor-pointer w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <Card className="bg-black/20 backdrop-blur-md border border-cyan-800/50 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-800/50 bg-black/40 p-6">
          <CardTitle className="text-xl text-cyan-400">
            {selectedClass ? `${CLASSES.find(c => c.value === selectedClass)?.label} Students` : 'Class List'}
          </CardTitle>
          
          {selectedClass && classStudents.length > 0 && (
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button 
                className="text-xs font-medium px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 transition-all flex items-center gap-1.5"
                onClick={() => handleMarkAll('PRESENT')}
              >
                <CheckCircle size={14} /> Mark All Present
              </button>
              <button 
                className="text-xs font-medium px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-1.5"
                onClick={() => handleMarkAll('ABSENT')}
              >
                <XCircle size={14} /> Mark All Absent
              </button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {errorAttendance && <div className="text-red-500 p-6">{errorAttendance}</div>}
          
          {!selectedClass ? (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
              <Users size={48} className="text-cyan-800/50" />
              <p>Please select a class from the dropdown to manage attendance.</p>
            </div>
          ) : loadingAttendance ? (
            <div className="text-center py-16 text-gray-500">Loading attendance data...</div>
          ) : classStudents.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
              <Users size={48} className="text-cyan-800/50" />
              <p>No students found in this class.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/60 text-cyan-400 border-b border-cyan-800/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wide">Roll No.</th>
                      <th className="px-6 py-4 font-semibold tracking-wide">Student Name</th>
                      <th className="px-6 py-4 font-semibold tracking-wide">Student ID</th>
                      <th className="px-6 py-4 font-semibold tracking-wide text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-800/30">
                    {classStudents.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber)).map((student) => {
                      const currentStatus = localAttendance[student.id];
                      
                      return (
                        <tr key={student.id} className="hover:bg-cyan-900/10 transition-colors">
                          <td className="px-6 py-4 text-gray-400">{student.rollNumber}</td>
                          <td className="px-6 py-4 font-medium text-white">{student.fullName}</td>
                          <td className="px-6 py-4 text-gray-400">{student.studentId}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all duration-300 font-medium ${
                                  currentStatus === 'PRESENT'
                                    ? 'bg-green-500/20 border-green-500 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] scale-105'
                                    : 'border-gray-800/50 bg-black/40 text-gray-500 hover:border-gray-600 hover:bg-gray-800/50'
                                }`}
                              >
                                <CheckCircle size={16} />
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all duration-300 font-medium ${
                                  currentStatus === 'ABSENT'
                                    ? 'bg-red-500/20 border-red-500 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-105'
                                    : 'border-gray-800/50 bg-black/40 text-gray-500 hover:border-gray-600 hover:bg-gray-800/50'
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

              {/* Sticky Footer for Save Button */}
              <div className="sticky bottom-0 p-6 bg-black/60 backdrop-blur-xl border-t border-cyan-800/50 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty}
                  className="flex items-center gap-2 px-6 py-2.5 text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                >
                  <Save size={20} />
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
