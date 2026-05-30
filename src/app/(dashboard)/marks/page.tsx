"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Save, 
  Search, 
  BookOpen, 
  Trophy,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { selectAllMarks, addMarksBulkThunk, fetchMarks, finalizeMarksThunk, unlockMarksThunk } from '@/lib/features/marksSlice';
import { selectGradeScales, fetchGradeScales } from '@/lib/features/settingsSlice';
import { Mark } from '@/types/models';
import { selectClasses, selectSubjects, selectExamTypes, fetchConfig } from '@/lib/features/configSlice';
import { selectClassesOverview, fetchClassesOverview } from '@/lib/features/classesSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { marksSchema } from '@/lib/validations';

export default function MarksPage() {
  const dispatch = useAppDispatch();
  const allStudents = useAppSelector(selectAllStudents);
  const allMarks = useAppSelector(selectAllMarks);
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);
  const EXAM_TYPES = useAppSelector(selectExamTypes);
  const auth = useAppSelector((state) => state.auth);
  const classesOverview = useAppSelector(selectClassesOverview);
  
  const loadingMarks = useAppSelector((state) => state.marks.loading);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
    reset,
  } = useForm<{ scores: Record<string, number | string> }>({
    defaultValues: { scores: {} },
    // We validate manually in onSave for dynamic keys, 
    // but the schema is available for single field refs if needed.
  });

  const scoresWatch = watch('scores');

  // Update maxScore when exam type changes
  useEffect(() => {
    if (selectedExamType) {
      const exam = EXAM_TYPES.find(e => e.value === selectedExamType);
      if (exam && (exam as any).baseMark) {
        setMaxScore(Number((exam as any).baseMark));
      }
    }
  }, [selectedExamType, EXAM_TYPES]);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    destructive: false,
    onConfirm: () => {}
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const gradeScales = useAppSelector(selectGradeScales);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
    dispatch(fetchClassesOverview());
    dispatch(fetchConfig());
    dispatch(fetchGradeScales());
  }, [dispatch]);

  const getGradeInfo = (percentage: number) => {
    if (!gradeScales || gradeScales.length === 0) {
      if (percentage >= 80) return { label: 'EXCELLENT', grade: 'A+', color: 'emerald' };
      if (percentage >= 60) return { label: 'GOOD', grade: 'B', color: 'blue' };
      if (percentage >= 33) return { label: 'AVERAGE', grade: 'C', color: 'amber' };
      return { label: 'FAILED', grade: 'F', color: 'red' };
    }
    
    // Sort descending to check highest minimums first
    const sorted = [...gradeScales].sort((a, b) => b.minScore - a.minScore);
    for (const scale of sorted) {
      if (percentage >= scale.minScore) {
        let color = 'emerald';
        if (scale.points < 2.0) color = 'red';
        else if (scale.points < 3.0) color = 'amber';
        else if (scale.points < 4.0) color = 'blue';
        return { label: scale.grade, grade: scale.grade, color };
      }
    }
    return { label: 'FAILED', grade: 'F', color: 'red' };
  };

  // Get available sections for the selected class
  const availableSections = useMemo(() => {
    const allSectionsOption = { value: '', label: 'All Sections' };
    if (!selectedClass) return [allSectionsOption];
    const classInfo = classesOverview.find(c => c.className === selectedClass);
    if (!classInfo) return [allSectionsOption];
    return [
      allSectionsOption,
      ...classInfo.sections.map(s => ({ value: s.section, label: `Section ${s.section}` }))
    ];
  }, [selectedClass, classesOverview]);

  // Check lock status
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExamType && selectedDate) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      fetch(`${API_URL}/marks/lock-status?className=${selectedClass}&subject=${selectedSubject}&examType=${selectedExamType}&date=${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setIsLocked(!!json.data.isLocked);
        } else {
          setIsLocked(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch lock status:', err);
        setIsLocked(false);
      });
    } else {
      // Reset lock status if filters are incomplete
      setIsLocked(false);
    }
  }, [selectedClass, selectedSubject, selectedExamType, selectedDate, auth.token]);

  // Filter students based on selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    let result = allStudents.filter(student => student.className === selectedClass);
    if (selectedSection) {
      result = result.filter(student => student.section === selectedSection);
    }
    return result;
  }, [allStudents, selectedClass, selectedSection]);

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    let result = [...classStudents]; // Create a copy to avoid in-place sorting
    if (searchQuery) {
      result = result.filter(student => 
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
  }, [selectedClass, selectedSection, selectedSubject, selectedExamType, selectedDate, searchQuery]);

  // Sync local marks when filters change
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExamType && selectedDate) {
      const marksMap: Record<string, number | string> = {};
      classStudents.forEach(student => {
        const existingMark = allMarks.find(m => 
          m.studentId === student.id && 
          m.subject === selectedSubject && 
          m.examType === selectedExamType &&
          m.date === selectedDate
        );
        marksMap[`student_${student.id}`] = existingMark !== undefined ? existingMark.score : '';
      });
      reset({ scores: marksMap });
    }
  }, [allMarks, selectedClass, selectedSubject, selectedExamType, selectedDate, classStudents, reset]);

  const onSave = (data: { scores: Record<string, number | string> }) => {
    if (!selectedClass || !selectedSubject || !selectedExamType) return;

    const recordsToSave: Partial<Mark>[] = [];
    
    Object.entries(data.scores).forEach(([idStr, score]) => {
      if (score !== '' && score !== null && score !== undefined) {
        const studentId = Number(idStr.replace('student_', ''));
        const scoreNum = Number(score);
        
        if (scoreNum > maxScore) {
          // Handled visually, but as a safety:
          return;
        }

        recordsToSave.push({
          studentId,
          subject: selectedSubject,
          examType: selectedExamType,
          score: scoreNum,
          maxScore: maxScore,
          date: selectedDate
        });
      }
    });

    if (recordsToSave.length === 0) {
      toast.error('No valid marks entered to save');
      return;
    }

    dispatch(addMarksBulkThunk(recordsToSave))
      .unwrap()
      .then(() => {
        toast.success('Academic results updated successfully');
        reset(data); // Mark as not dirty
      })
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to save marks'));
  };

  const handleFinalize = () => {
    if (!selectedClass || !selectedSubject || !selectedExamType || !selectedDate) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Finalize Marks',
      message: 'Finalizing marks will lock them for regular editing and notify all administrators. Are you sure?',
      confirmText: 'Finalize',
      destructive: false,
      onConfirm: () => {
        dispatch(finalizeMarksThunk({
          className: selectedClass,
          subject: selectedSubject,
          examType: selectedExamType,
          date: selectedDate
        }))
        .unwrap()
        .then(() => {
          toast.success('Marks finalized and locked successfully');
          setIsLocked(true);
        })
        .catch((err) => toast.error(err || 'Failed to finalize marks'));
      }
    });
  };

  const handleUnlock = () => {
    if (!selectedClass || !selectedSubject || !selectedExamType || !selectedDate) return;

    setConfirmModal({
      isOpen: true,
      title: 'Unlock Marks',
      message: 'Are you sure you want to unlock these marks? This will allow editing by teachers.',
      confirmText: 'Unlock',
      destructive: false,
      onConfirm: () => {
        dispatch(unlockMarksThunk({
          className: selectedClass,
          subject: selectedSubject,
          examType: selectedExamType,
          date: selectedDate
        }))
        .unwrap()
        .then(() => {
          toast.success('Marks unlocked successfully');
          setIsLocked(false);
        })
        .catch((err) => toast.error(err || 'Failed to unlock marks'));
      }
    });
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary rounded-lg border border-blue-100">
            <Trophy size={16} className="text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Max Score</span>
              <span className="text-slate-900 font-bold text-sm h-4 mt-0.5">{maxScore}</span>
            </div>
          </div>
          <Button 
            onClick={handleSubmit(onSave)} 
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
          {isLocked && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 font-bold text-xs animate-pulse">
              <AlertCircle size={16} />
              ENTRY LOCKED
            </div>
          )}
          {isLocked && (auth.role === 'ADMIN' || auth.user?.role === 'ADMIN') && (
            <Button 
              onClick={handleUnlock} 
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 h-10 animate-in fade-in zoom-in duration-300"
            >
              <ArrowRight size={18} className="mr-2 rotate-180" />
              Unlock Marks
            </Button>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-500">
          <AlertCircle className="text-amber-500" size={24} />
          <div>
            <h4 className="text-amber-800 font-bold text-sm">Marks for this assessment are currently locked.</h4>
            <p className="text-amber-700/80 text-xs mt-0.5">This result set has been finalized and is currently in read-only mode. { (auth.role === 'ADMIN' || auth.user?.role === 'ADMIN') ? 'Use the "Unlock Marks" button above to enable editing.' : 'Contact an administrator if changes are required.' }</p>
          </div>
        </div>
      )}

      <Card className="border-slate-200/60 shadow-sm p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <Select 
            label="Grade / Class"
            placeholder="Choose class"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
            }}
            options={CLASSES}
          />
          <Select 
            label="Section"
            placeholder="Choose section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
            options={availableSections}
          />
          <Select 
            label="Academic Subject"
            placeholder="Choose subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
            options={SUBJECTS}
          />
          <Select 
            label="Assessment Type"
            placeholder="Choose assessment"
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            disabled={!selectedSubject}
            options={EXAM_TYPES}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 ml-0.5">Examination Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-standard shadow-sm"
            />
          </div>
        </div>
      </Card>

      {/* Marks Entry Table */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0 flex flex-col min-h-[440px]">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            {selectedClass && selectedSubject && selectedExamType 
              ? `${CLASSES.find(c => c.value === selectedClass)?.label}${selectedSection ? ` (Sec ${selectedSection})` : ''} • ${SUBJECTS.find(s => s.value === selectedSubject)?.label} • ${EXAM_TYPES.find(t => t.value === selectedExamType)?.label}` 
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
            <form onSubmit={handleSubmit(onSave)} className="flex flex-col h-full">
              <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-340px)] custom-scrollbar">
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
                      const score = scoresWatch?.[`student_${student.id}`] ?? '';
                      const percentage = score !== '' ? Math.round((Number(score) / maxScore) * 100) : null;
                      const hasError = Number(score) > maxScore;
                      
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
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center gap-3">
                                <div className="relative group/input">
                                  <input 
                                    type="number"
                                    placeholder="0"
                                    value={score}
                                    onChange={(e) => setValue(`scores.student_${student.id}`, e.target.value, { shouldDirty: true })}
                                    disabled={isLocked}
                                    className={`w-24 bg-slate-50 border rounded-lg px-3 py-2 text-center text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-standard font-extrabold text-lg disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                                      hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                                    }`}
                                  />
                                </div>
                                <span className="text-slate-400 font-bold text-xs tracking-widest">/ {maxScore}</span>
                              </div>
                              {hasError && <span className="text-[10px] text-red-500 font-bold mt-1">Exceeds Max</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {percentage !== null ? (
                              <div className="flex flex-col items-end gap-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest border bg-${getGradeInfo(percentage).color}-50 text-${getGradeInfo(percentage).color}-700 border-${getGradeInfo(percentage).color}-100`}>
                                  {getGradeInfo(percentage).label}
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

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-slate-50/30">
                {paginatedStudents.map((student) => {
                  const score = scoresWatch?.[`student_${student.id}`] ?? '';
                  const percentage = score !== '' ? Math.round((Number(score) / maxScore) * 100) : null;
                  const hasError = Number(score) > maxScore;
                  
                  return (
                    <div key={student.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 shrink-0">
                          {student.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-tight">{student.fullName}</span>
                          <span className="text-xs text-slate-500 font-medium mt-0.5">
                            ID: {student.studentId} • Roll: {student.rollNumber}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Earned Score</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              placeholder="0"
                              value={score}
                              onChange={(e) => setValue(`scores.student_${student.id}`, e.target.value, { shouldDirty: true })}
                              disabled={isLocked}
                              className={`w-24 min-h-[44px] bg-slate-50 border rounded-lg px-3 py-2 text-center text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-standard font-extrabold text-lg disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                                hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                              }`}
                            />
                            <span className="text-slate-400 font-bold text-sm">/ {maxScore}</span>
                          </div>
                          {hasError && <span className="text-[10px] text-red-500 font-bold">Exceeds Max</span>}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</label>
                          {percentage !== null ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest border bg-${getGradeInfo(percentage).color}-50 text-${getGradeInfo(percentage).color}-700 border-${getGradeInfo(percentage).color}-100`}>
                                {getGradeInfo(percentage).label}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{percentage}% Achieved</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic min-h-[24px] flex items-center">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    <span className="text-primary font-black">{Object.values(scoresWatch || {}).filter(v => v !== '' && v !== null).length}</span> 
                    / {filteredStudents.length} entries completed
                  </span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 text-xs font-bold">
                    <AlertCircle size={14} className="text-amber-500" />
                    Autosave Disabled
                  </div>
                  <Button 
                    type="submit"
                    disabled={!isDirty || !isFormValid || isLocked}
                    className={`px-10 py-3 font-black text-sm uppercase tracking-widest shadow-xl transition-all ${isDirty ? 'shadow-blue-200 scale-100' : 'shadow-none scale-95'}`}
                  >
                    Publish Results
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      <ConfirmationModal 
        {...confirmModal} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
      />
    </div>
  );
}
