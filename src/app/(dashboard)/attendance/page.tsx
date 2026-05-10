"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Save, CheckCircle, XCircle, Users, LayoutList, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { 
  selectAllAttendanceRecords, 
  addDailyRecordsBulkThunk,
  fetchAttendance,
  AttendanceSummary
} from '@/lib/features/attendanceSlice';
import { fetchClassesOverview, selectClassesOverview } from '@/lib/features/classesSlice';
import { Attendance, AttendanceStatus } from '@/types/models';
import { selectClasses } from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export default function AttendancePage() {
  const dispatch = useAppDispatch();
  const allStudents = useAppSelector(selectAllStudents);
  const CLASSES = useAppSelector(selectClasses);
  const classesOverview = useAppSelector(selectClassesOverview);
  
  const loadingAttendance = useAppSelector((state) => state.attendance.loading);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAttendance());
    dispatch(fetchClassesOverview());
  }, [dispatch]);

  const availableSections = useMemo(() => {
    const classData = classesOverview.find(c => c.className === selectedClass);
    return classData ? classData.sections.map(s => ({ value: s.section, label: `Sec ${s.section}` })).sort((a, b) => a.value.localeCompare(b.value)) : [];
  }, [classesOverview, selectedClass]);

  // Filter students based on selected class and section
  const classStudents = useMemo(() => {
    if (!selectedClass || !selectedSection) return [];
    return allStudents
      .filter(student => student.className === selectedClass && student.section === selectedSection)
      .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
  }, [allStudents, selectedClass, selectedSection]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return classStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [classStudents, currentPage]);

  const totalPages = Math.ceil(classStudents.length / itemsPerPage);

  useEffect(() => {
    setSelectedSection('');
    setCurrentPage(1);
  }, [selectedClass]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSection]);

  // Get records from Redux for the currently selected date
  const allRecords = useAppSelector(selectAllAttendanceRecords);
  const storeRecords = useMemo(() => 
    allRecords.filter(record => record.date === selectedDate), 
  [allRecords, selectedDate]);

  // Local state to manage toggles before saving
  const [localAttendance, setLocalAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Sync local attendance state when selectedDate, storeRecords, or classStudents change
  useEffect(() => {
    const attendanceMap: Record<number, AttendanceStatus> = {};
    
    classStudents.forEach(student => {
      const record = storeRecords.find(r => r.studentId === student.id);
      if (record) {
        attendanceMap[student.id] = record.status;
      }
    });

    setLocalAttendance(attendanceMap);
    setIsDirty(false);
  }, [storeRecords, selectedDate, classStudents]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsDirty(true);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<number, AttendanceStatus> = {};
    classStudents.forEach(student => {
      newMap[student.id] = status;
    });
    setLocalAttendance(newMap);
    setIsDirty(true);
  };

  const handleSave = () => {
    const recordsToSave: Partial<Attendance>[] = classStudents.map(student => {
      const existingRecord = storeRecords.find(r => r.studentId === student.id);
      return {
        id: existingRecord?.id,
        studentId: student.id,
        date: selectedDate,
        status: localAttendance[student.id] || 'ABSENT',
      };
    });

    dispatch(addDailyRecordsBulkThunk(recordsToSave))
      .unwrap()
      .then(() => toast.success('Attendance records updated'))
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to save attendance'));
    setIsDirty(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Daily Attendance
          </h1>
          <p className="text-slate-500 font-medium mt-1">Record and manage daily student presence by class.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <Select 
            placeholder="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={CLASSES}
            className="!w-full sm:!w-40 h-10"
          />

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          <Select 
            placeholder="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass || availableSections.length === 0}
            options={availableSections}
            className="!w-full sm:!w-32 h-10"
          />

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          <div className="relative w-full sm:w-44">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-primary/20 transition-standard cursor-pointer h-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0 flex flex-col min-h-[400px]">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-primary" />
            {selectedClass && selectedSection ? `${CLASSES.find(c => c.value === selectedClass)?.label} - Sec ${selectedSection} Students` : 'Class Roster'}
          </CardTitle>
          
          {selectedClass && selectedSection && classStudents.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-[11px] font-bold"
                onClick={() => handleMarkAll('PRESENT')}
              >
                <CheckCircle size={14} className="mr-1.5" /> Mark All Present
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[11px] font-bold"
                onClick={() => handleMarkAll('ABSENT')}
              >
                <XCircle size={14} className="mr-1.5" /> Mark All Absent
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!selectedClass || !selectedSection ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
                <LayoutList size={48} />
              </div>
              <h3 className="text-slate-900 font-bold">Select a Class and Section</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-[280px]">Choose a class and section from the header to start marking daily attendance records.</p>
            </div>
          ) : loadingAttendance ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="mt-4 text-slate-400 font-medium text-sm">Fetching class data...</span>
            </div>
          ) : classStudents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
                <Users size={48} />
              </div>
              <h3 className="text-slate-900 font-bold">Empty Class</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-[280px]">There are no students registered in this class yet.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                  <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] w-24">Roll No</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Student Name</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Identification</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-center">Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedStudents.map((student) => {
                      const currentStatus = localAttendance[student.id];
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-standard group">
                          <td className="px-6 py-4 text-slate-900 font-bold font-mono">{student.rollNumber}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                                {student.fullName.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900">{student.fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {student.studentId}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                                  currentStatus === 'PRESENT'
                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-100'
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                <CheckCircle size={14} />
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                                  currentStatus === 'ABSENT'
                                    ? 'bg-red-500 border-red-600 text-white shadow-md shadow-red-100'
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                <XCircle size={14} />
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

              {/* Pagination Footer */}
              {classStudents.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Showing {Math.min(classStudents.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(classStudents.length, currentPage * itemsPerPage)} of {classStudents.length} Students
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="bg-white h-8 text-[10px] font-black"
                    >
                      Prev
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-7 w-7 rounded-lg text-[10px] font-black transition-standard ${
                            currentPage === page
                              ? 'bg-primary text-white shadow-md shadow-blue-100'
                              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="bg-white h-8 text-[10px] font-black"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Sticky Footer for Save Button */}
              <div className="mt-auto p-6 bg-white border-t border-slate-100 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <CheckSquare size={18} className="text-primary" />
                  <span>{Object.values(localAttendance).filter(v => v === 'PRESENT').length} students present today</span>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty}
                  className={`px-8 py-2.5 shadow-lg transition-all ${isDirty ? 'shadow-blue-200 scale-100' : 'shadow-none scale-95'}`}
                >
                  <Save size={18} className="mr-2" />
                  Save Class Records
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
