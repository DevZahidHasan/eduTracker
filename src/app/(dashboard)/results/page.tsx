'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchParentDashboard, selectParentDashboardData, fetchParentResults } from '@/lib/features/parentSlice';
import { Card, CardContent } from '@/components/ui/Card';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Select } from '@/components/ui/Select';

export default function ParentResultsView() {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectParentDashboardData);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isDetailed, setIsDetailed] = useState(false);

  useEffect(() => {
    dispatch(fetchParentDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(dashboardData[0].student.id);
    }
  }, [dashboardData, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      const urlParams = selectedExamType ? { studentId: selectedStudentId, examType: selectedExamType } : { studentId: selectedStudentId };
      dispatch(fetchParentResults(urlParams as any))
        .unwrap()
        .then((data: any) => {
          if (selectedExamType) {
            setResults(data.marks);
            setIsDetailed(true);
          } else {
            setResults(data);
            setIsDetailed(false);
          }
        })
        .catch(console.error);
    }
  }, [dispatch, selectedStudentId, selectedExamType]);

  if (dashboardData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No Students Linked</h3>
      </div>
    );
  }

  const studentOptions = dashboardData.map(d => ({
    value: d.student.id.toString(),
    label: d.student.fullName
  }));

  // Simple exam type options based on the results from aggregate view
  const examTypeOptions = results.length > 0 && !isDetailed 
    ? Array.from(new Set(results.map((r: any) => r.examType))).map(t => ({ value: t, label: t as string }))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Academic Results</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {isDetailed && (
             <Button variant="outline" onClick={() => { setSelectedExamType(''); }}>Back to Summary</Button>
          )}
          {dashboardData.length > 1 && (
            <div className="w-full sm:w-48">
              <Select
                value={selectedStudentId?.toString() || ''}
                onChange={(e) => { setSelectedStudentId(Number(e.target.value)); setSelectedExamType(''); }}
                options={studentOptions}
              />
            </div>
          )}
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {isDetailed ? (
                    <>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Subject</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Marks</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Grade</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Exam</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Marks</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Grade</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((res, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 cursor-pointer" onClick={() => !isDetailed && setSelectedExamType(res.examType)}>
                    {isDetailed ? (
                      <>
                        <td className="px-6 py-4 font-semibold text-slate-900">{res.subject}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{res.score} / {res.maxScore}</td>
                        <td className="px-6 py-4 font-bold text-blue-600">{res.grade}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-semibold text-slate-900">{res.examType}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{res.obtainedMarks} / {res.totalMarks}</td>
                        <td className="px-6 py-4 font-bold text-blue-600">{res.grade}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${res.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {res.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
