"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Save, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Trophy,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { 
  selectAllMarks, 
  addMarksBulkThunk,
  fetchMarks,
  Mark,
  ExamType,
  Subject
} from '@/lib/features/marksSlice';
import { selectClasses, selectSubjects, selectExamTypes } from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MarksPage() {
  const dispatch = useAppDispatch();
  const allStudents = useAppSelector(selectAllStudents);
  const allMarks = useAppSelector(selectAllMarks);
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);
  const EXAM_TYPES = useAppSelector(selectExamTypes);
  
  const loadingMarks = useAppSelector((state) => state.marks.loading);
  const errorMarks = useAppSelector((state) => state.marks.error);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedExamType, setSelectedExamType] = useState<ExamType | ''>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxScore, setMaxScore] = useState<string>('100');
  const [searchQuery, setSearchQuery] = useState('');

  // Local marks state for bulk entry
  const [localMarks, setLocalMarks] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
  }, [dispatch]);

  // Filter students based on selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return allStudents.filter(student => student.className === selectedClass);
  }, [allStudents, selectedClass]);

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return classStudents;
    return classStudents.filter(student => 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classStudents, searchQuery]);

  // Sync local marks when filters change
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExamType) {
      const marksMap: Record<string, string> = {};
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

  const handleMarkChange = (studentId: string, score: string) => {
    // Validate number input
    if (score !== '' && isNaN(Number(score))) return;
    if (Number(score) > Number(maxScore)) return;

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
        subject: selectedSubject as Subject,
        examType: selectedExamType as ExamType,
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
      .then(() => toast.success('Marks saved successfully'))
      .catch((err) => toast.error(err || 'Failed to save marks'));
    setIsDirty(false);
  };

  const isFormValid = selectedClass && selectedSubject && selectedExamType && maxScore;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Controls Section */}
      <div className="bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-neon text-glow flex items-center gap-3">
              <ClipboardCheck className="text-cyan-400" size={32} />
              Marks Management
            </h1>
            <p className="text-gray-400">Class-wise result entry and management system.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl">
            <Trophy className="text-yellow-400" size={20} />
            <div className="text-sm">
              <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider">Max Score</span>
              <input 
                type="number" 
                value={maxScore} 
                onChange={(e) => setMaxScore(e.target.value)}
                className="bg-transparent text-white border-none focus:outline-none w-16 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
              <GraduationCap size={14} /> Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300"
            >
              <option value="" disabled>Select Class</option>
              {CLASSES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
              <BookOpen size={14} /> Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject)}
              disabled={!selectedClass}
              className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
            >
              <option value="" disabled>Select Subject</option>
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Exam Type Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
              <Trophy size={14} /> Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
              disabled={!selectedSubject}
              className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
            >
              <option value="" disabled>Select Exam Type</option>
              {EXAM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
              <Filter size={14} /> Exam Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      <Card className="bg-black/20 backdrop-blur-md border border-cyan-800/50 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
        <CardHeader className="border-b border-cyan-800/50 bg-black/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl text-cyan-400">
            {selectedClass && selectedSubject && selectedExamType 
              ? `Marks Entry: ${CLASSES.find(c => c.value === selectedClass)?.label} - ${SUBJECTS.find(s => s.value === selectedSubject)?.label}` 
              : 'Student List'}
          </CardTitle>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-cyan-800/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative">
          {errorMarks && <div className="text-red-500 p-6">{errorMarks}</div>}
          
          {!isFormValid ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-4">
              <div className="p-6 rounded-full bg-cyan-950/30 border border-cyan-800/30">
                <BookOpen size={48} className="text-cyan-800/50" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-400">Setup Exam Details First</p>
                <p className="text-sm">Select class, subject, and exam type to start entry.</p>
              </div>
            </div>
          ) : loadingMarks ? (
            <div className="text-center py-24 text-gray-500">Loading records...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-24 text-gray-500">No students found matching your criteria.</div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/60 text-cyan-400 border-b border-cyan-800/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Roll No.</th>
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Student ID</th>
                      <th className="px-6 py-4 font-semibold text-center w-48">Score Obtained</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-800/30">
                    {filteredStudents.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber)).map((student) => {
                      const score = localMarks[student.id] || '';
                      const percentage = score !== '' ? Math.round((Number(score) / Number(maxScore)) * 100) : null;
                      
                      return (
                        <tr key={student.id} className="hover:bg-cyan-900/10 transition-colors">
                          <td className="px-6 py-4 text-gray-400 font-mono">{student.rollNumber}</td>
                          <td className="px-6 py-4 font-medium text-white">{student.fullName}</td>
                          <td className="px-6 py-4 text-gray-400">{student.studentId}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <input 
                                type="text"
                                value={score}
                                placeholder="00"
                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                className="w-20 bg-black/60 border border-cyan-800/50 rounded-lg px-3 py-2 text-center text-white focus:outline-none focus:border-cyan-500 transition-all font-bold text-lg"
                              />
                              <span className="text-gray-500 font-medium">/ {maxScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {percentage !== null ? (
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                percentage >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                                percentage >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                percentage >= 33 ? 'bg-orange-500/10 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                                'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                              }`}>
                                {percentage}% - {percentage >= 33 ? 'PASSED' : 'FAILED'}
                              </span>
                            ) : (
                              <span className="text-gray-600 italic">Pending Entry</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sticky Footer for Save Button */}
              <div className="sticky bottom-0 p-6 bg-black/80 backdrop-blur-xl border-t border-cyan-800/50 flex justify-between items-center z-10">
                <div className="text-sm text-gray-400">
                  <span className="text-cyan-400 font-bold">{Object.values(localMarks).filter(v => v !== '').length}</span> students marked out of <span className="text-white">{filteredStudents.length}</span>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty || !isFormValid}
                  className="flex items-center gap-2 px-8 py-3 text-lg font-bold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all group"
                >
                  <Save size={22} className="group-hover:scale-110 transition-transform" />
                  Save Class Results
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
