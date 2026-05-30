'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchParentDashboard, selectParentDashboardData, fetchParentResults } from '@/lib/features/parentSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { AlertCircle, GraduationCap, Download, FileText } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ParentResultsView() {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectParentDashboardData);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);

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
      dispatch(fetchParentResults({ studentId: selectedStudentId } as any))
        .unwrap()
        .then((data: any) => {
          setResults(data);
        })
        .catch(console.error);
    }
  }, [dispatch, selectedStudentId]);

  const handleDownloadReport = async (studentId: number, examType: string, studentName: string) => {
    try {
      const response = await api.get(`/parent/report/${studentId}/${examType}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ReportCard_${studentName.replace(/\s+/g, '_')}_${examType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download report');
    }
  };

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

  const selectedStudentName = dashboardData.find(d => d.student.id === selectedStudentId)?.student.fullName || 'Student';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Academic Results</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {dashboardData.length > 1 && (
            <div className="w-full sm:w-48">
              <Select
                value={selectedStudentId?.toString() || ''}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                options={studentOptions}
              />
            </div>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Results Found</h3>
            <p className="text-slate-500 text-sm mt-1">There are currently no academic results available for this student.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {results.map((res, idx) => (
            <Card key={idx} className="border-slate-200/60 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileText className="text-primary" size={24} />
                    {res.title || res.examType}
                  </CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">
                    GPA: <span className="font-bold text-slate-700">{res.gpa?.toFixed(2)}</span> • 
                    Grade: <span className="font-bold text-primary">{res.grade}</span> • 
                    Avg: <span className="font-bold text-slate-700">{res.percentage?.toFixed(1)}%</span>
                  </CardDescription>
                </div>
                
                {res.canDownload ? (
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm whitespace-nowrap"
                    onClick={() => handleDownloadReport(selectedStudentId!, res.examType, selectedStudentName)}
                  >
                    <Download size={16} className="mr-2" /> Download Report Card
                  </Button>
                ) : (
                  <div className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                    <AlertCircle size={14} />
                    Pending full term publication
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Subject</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Tutorial</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Term / Final</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Total</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {res.marks && res.marks.length > 0 ? (
                        res.marks.map((mark: any, mIdx: number) => (
                          <tr key={mIdx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{mark.subject}</td>
                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                              {mark.tutorial !== undefined ? mark.tutorial : '-'}
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                              {mark.final !== undefined ? mark.final : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-black text-slate-900">{mark.score}</span>
                              <span className="text-xs text-slate-400 font-medium ml-1">/ {mark.maxScore}</span>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-primary">
                              {mark.grade || '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">
                            No subject breakdown available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
