"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Save, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Trophy,
  Filter,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { 
  selectAllMarks, 
  addMarksBulkThunk,
  fetchMarks,
  finalizeMarksThunk
} from '@/lib/features/marksSlice';
import { Mark } from '@/types/models';
import { selectClasses, selectSubjects, selectExamTypes } from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RootState } from '@/lib/store';

export default function MarksPage() {
  const dispatch = useAppDispatch();
  const allStudents = useAppSelector(selectAllStudents);
  const allMarks = useAppSelector(selectAllMarks);
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);
  const EXAM_TYPES = useAppSelector(selectExamTypes);
  const auth = useAppSelector((state) => state.auth);
  
  const loadingMarks = useAppSelector((state) => state.marks.loading);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxScore, setMaxScore] = useState<string>('100');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Local marks state for bulk entry
  const [localMarks, setLocalMarks] = useState<Record<number, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
  }, [dispatch]);

  // Check lock status
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExamType) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      fetch(`${API_URL}/marks/lock-status?className=${selectedClass}&subject=${selectedSubject}&examType=${selectedExamType}`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      .then(res => res.json())
      .then(json => {
        setIsLocked(json.data.isLocked);
      })
      .catch(err => console.error('Failed to fetch lock status:', err));
    }
  }, [selectedClass, selectedSubject, selectedExamType, auth.token]);

  // Filter students based on selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return allStudents.filter(student => student.className === selectedClass);
  }, [allStudents, selectedClass]);

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    let result = classStudents;
    if (searchQuery) {
      result = classStudents.filter(student => 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.includes(searchQuery) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
  }, [classStudents, searchQuery]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSubject, selectedExamType, searchQuery]);

  // Sync local marks when filters change
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExamType) {
      const marksMap: Record<number, string> = {};
      classStudents.forEach(student => {
        const existingMark = allMarks.find(m => 
          m.studentId === student.id && 
          m.subject === selectedSubject && 
          m.examType === selectedExamType
        );
        if (existingMark) {
          marksMap[student.id] = existingMark.score.toString();
        } else {
          marksMap[student.id] = '';
        }
      });
      setLocalMarks(marksMap);
      setIsDirty(false);
    }
  }, [allMarks, selectedClass, selectedSubject, selectedExamType, classStudents]);

  const handleMarkChange = (studentId: number, score: string) => {
    // Validate number input
    if (score !== '' && isNaN(Number(score))) return;
    if (Number(score) > Number(maxScore)) {
      toast.error(`Score cannot exceed max score (${maxScore})`, { id: 'max-score-error' });
      return;
    }

    setLocalMarks(prev => ({
      ...prev,
      [studentId]: score
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!selectedClass || !selectedSubject || !selectedExamType) return;

    const recordsToSave: Partial<Mark>[] = classStudents
      .filter(student => localMarks[student.id] !== '')
      .map(student => ({
        studentId: student.id,
        subject: selectedSubject,
        examType: selectedExamType,
        score: Number(localMarks[student.id]),
        maxScore: Number(maxScore),
        date: selectedDate
      }));

    if (recordsToSave.length === 0) {
      toast.error('No marks entered to save');
      return;
    }

    dispatch(addMarksBulkThunk(recordsToSave))
      .unwrap()
      .then(() => toast.success('Academic results updated successfully'))
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to save marks'));
    setIsDirty(false);
  };

  const handleFinalize = () => {
    if (!selectedClass || !selectedSubject || !selectedExamType) return;
    
    if (confirm('Finalizing marks will lock them for regular editing and notify all administrators. Are you sure?')) {
      dispatch(finalizeMarksThunk({
        className: selectedClass,
        subject: selectedSubject,
        examType: selectedExamType
      }))
      .unwrap()
      .then(() => {
        toast.success('Marks finalized and locked successfully');
        setIsLocked(true);
      })
      .catch((err) => toast.error(err || 'Failed to finalize marks'));
    }
  };

  const isFormValid = selectedClass && selectedSubject && selectedExamType && maxScore;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Academic Grading</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and publish student results by class and subject.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
          {isLocked && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100 font-bold text-xs">
              <AlertCircle size={16} />
              LOCKED
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary rounded-lg border border-blue-100">
            <Trophy size={16} className="text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Max Score</span>
              <input 
                type="number" 
                value={maxScore} 
                onChange={(e) => setMaxScore(e.target.value)}
                disabled={isLocked}
                className="bg-transparent text-slate-900 border-none focus:outline-none w-12 font-bold text-sm h-4 mt-0.5 disabled:opacity-50"
              />
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!isDirty || !isFormValid || isLocked}
            className="shadow-md shadow-blue-100 px-6 py-2 h-10"
          >
            <Save size={18} className="mr-2" />
            {isLocked ? 'Locked' : 'Save Results'}
          </Button>
          {!isLocked && isFormValid && (
            <Button 
              onClick={handleFinalize} 
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50 h-10"
            >
              <ClipboardCheck size={18} className="mr-2" />
              Finalize
            </Button>
          )}
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Class Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Grade / Class</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard cursor-pointer outline-none"
              >
                <option value="" disabled>Choose class</option>
                {CLASSES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Academic Subject</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!selectedClass}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard cursor-pointer outline-none disabled:opacity-50"
              >
                <option value="" disabled>Choose subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exam Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Assessment Type</label>
            <div className="relative">
              <ClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                disabled={!selectedSubject}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard cursor-pointer outline-none disabled:opacity-50"
              >
                <option value="" disabled>Choose assessment</option>
                {EXAM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Examination Date</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard cursor-pointer outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Marks Entry Table */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0 flex flex-col min-h-[440px]">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            {selectedClass && selectedSubject && selectedExamType 
              ? `${CLASSES.find(c => c.value === selectedClass)?.label} • ${SUBJECTS.find(s => s.value === selectedSubject)?.label} • ${EXAM_TYPES.find(t => t.value === selectedExamType)?.label}` 
              : 'Result Entry Portal'}
          </CardTitle>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Quick search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-standard focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none shadow-sm"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative flex flex-col">
          {!isFormValid ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 bg-blue-50 rounded-full text-blue-200 border border-blue-50 mb-4">
                <BookOpen size={48} />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">Initialize Result Entry</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-[320px]">Select a class, subject, and assessment type above to open the grading table for the class.</p>
              <div className="mt-6 flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <AlertCircle size={14} />
                Requires Administrator Privileges
              </div>
            </div>
          ) : loadingMarks ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24">
              <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="mt-4 text-slate-400 font-medium text-sm">Processing records...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 bg-slate-50 rounded-full text-slate-200 border border-slate-100 mb-4">
                <Users size={48} />
              </div>
              <h3 className="text-slate-900 font-bold">No Students Registered</h3>
              <p className="text-slate-500 text-sm mt-1">There are no students found in this class to assign marks to.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto max-h-[calc(100vh-340px)] custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                  <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] w-24">Roll No</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Student Name</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Student ID</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-center w-56">Earned Score</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-right">Academic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedStudents.map((student) => {
                      const score = localMarks[student.id] || '';
                      const percentage = score !== '' ? Math.round((Number(score) / Number(maxScore)) * 100) : null;
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-standard group">
                          <td className="px-6 py-4 text-slate-900 font-bold font-mono">{student.rollNumber}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
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
                            <div className="flex items-center justify-center gap-3">
                              <div className="relative group/input">
                                <input 
                                  type="text"
                                  value={score}
                                  placeholder="0"
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                  disabled={isLocked}
                                  className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-standard font-extrabold text-lg disabled:opacity-50"
                                />
                              </div>
                              <span className="text-slate-400 font-bold text-xs tracking-widest">/ {maxScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {percentage !== null ? (
                              <div className="flex flex-col items-end gap-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                                  percentage >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  percentage >= 60 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  percentage >= 33 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                  'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                  {percentage >= 80 ? 'EXCELLENT' : 
                                   percentage >= 60 ? 'GOOD' : 
                                   percentage >= 33 ? 'AVERAGE' : 'FAILED'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{percentage}% Achieved</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {filteredStudents.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Entry {Math.min(filteredStudents.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredStudents.length, currentPage * itemsPerPage)} of {filteredStudents.length} Students
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
                <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>
                    <span className="text-primary font-black">{Object.values(localMarks).filter(v => v !== '').length}</span> 
                    / {filteredStudents.length} entries completed
                  </span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 text-xs font-bold">
                    <AlertCircle size={14} className="text-amber-500" />
                    Autosave Disabled
                  </div>
                  <Button 
                    onClick={handleSave} 
                    disabled={!isDirty || !isFormValid}
                    className={`px-10 py-3 font-black text-sm uppercase tracking-widest shadow-xl transition-all ${isDirty ? 'shadow-blue-200 scale-100' : 'shadow-none scale-95'}`}
                  >
                    Publish Results
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
