"use client";

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { selectAllMarks, fetchMarks, addMarksThunk } from '@/lib/features/marksSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Physical Education',
  'Art',
];

export default function MarksPage() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectAllStudents);
  const marks = useAppSelector(selectAllMarks);
  
  const loadingMarks = useAppSelector((state) => state.marks.loading);
  const errorMarks = useAppSelector((state) => state.marks.error);

  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !subject || !score || !maxScore || !date) {
      setError('Please fill in all fields.');
      return;
    }

    const numScore = Number(score);
    const numMaxScore = Number(maxScore);

    if (numScore < 0 || numMaxScore < 1 || numScore > numMaxScore) {
      setError('Invalid score. Ensure score is between 0 and max score.');
      return;
    }

    dispatch(
      addMarksThunk({
        studentId,
        subject,
        score: numScore,
        maxScore: numMaxScore,
        date,
      })
    );

    setScore('');
    setError('');
  };

  const getStudentName = (id: string) => {
    const student = students.find((s) => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-neon text-glow">Marks Entry</h1>
        <p className="text-gray-400">Record and manage student marks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-gray-700 text-foreground transition-all duration-300 focus:outline-none focus:border-neon focus:glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-gray-700 text-foreground transition-all duration-300 focus:outline-none focus:border-neon focus:glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a subject...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Score"
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g., 85"
                  min="0"
                  max={maxScore}
                />
                <Input
                  label="Max Score"
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="e.g., 100"
                  min="1"
                />
              </div>

              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Button type="submit" className="w-full mt-4">
                Save Marks
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Marks</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMarks && <div className="text-red-500 mb-4">{errorMarks}</div>}
            {loadingMarks ? (
              <div className="text-center py-12 text-gray-500">Loading marks data...</div>
            ) : marks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                No marks recorded yet. Add some marks to see them here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">Student</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">Subject</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400 text-right">Score</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => {
                      const percentage = Math.round((mark.score / mark.maxScore) * 100);
                      return (
                        <tr
                          key={mark.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-300">
                            {new Date(mark.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-white">
                            {getStudentName(mark.studentId)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-300">{mark.subject}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-300">
                            <span className="text-white font-medium">{mark.score}</span> /{' '}
                            {mark.maxScore}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <span
                              className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                                percentage >= 80
                                  ? 'bg-green-500/10 text-green-400'
                                  : percentage >= 60
                                  ? 'bg-yellow-500/10 text-yellow-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
