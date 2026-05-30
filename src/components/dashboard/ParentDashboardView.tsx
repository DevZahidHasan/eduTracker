import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchParentDashboard, selectParentDashboardData, selectParentLoading, ParentDashboardData } from '@/lib/features/parentSlice';
import { Card, CardContent } from '@/components/ui/Card';
import { Calendar, CreditCard, GraduationCap, CheckCircle, XCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ParentDashboardView() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectParentLoading);
  const dashboardData = useAppSelector(selectParentDashboardData);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchParentDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(dashboardData[0].student.id);
    }
  }, [dashboardData, selectedStudentId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (dashboardData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No Students Linked</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">
          There are currently no students linked to your parent account. Please contact the school administration to resolve this.
        </p>
      </div>
    );
  }

  const currentData = dashboardData.find(d => d.student.id === selectedStudentId) || dashboardData[0];
  const { student, attendanceToday, totalDue, unpaidVouchers, latestResult } = currentData;

  const studentOptions = dashboardData.map(d => ({
    value: d.student.id.toString(),
    label: d.student.fullName
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Child Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{student.fullName}</h1>
            <p className="text-sm text-slate-500 font-medium">Class {student.className} - Sec {student.section} • Roll {student.rollNumber}</p>
          </div>
        </div>

        {dashboardData.length > 1 && (
          <div className="w-full sm:w-64">
            <Select
              value={selectedStudentId?.toString() || ''}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              options={studentOptions}
            />
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Card */}
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${attendanceToday === 'PRESENT' ? 'bg-emerald-500' : attendanceToday === 'ABSENT' ? 'bg-red-500' : attendanceToday === 'LATE' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Attendance</p>
                <div className="flex items-center gap-2 mt-2">
                  {attendanceToday === 'PRESENT' ? (
                    <><CheckCircle className="text-emerald-500" size={24} /><span className="text-2xl font-black text-slate-900">Present</span></>
                  ) : attendanceToday === 'ABSENT' ? (
                    <><XCircle className="text-red-500" size={24} /><span className="text-2xl font-black text-slate-900">Absent</span></>
                  ) : attendanceToday === 'LATE' ? (
                    <><Clock className="text-amber-500" size={24} /><span className="text-2xl font-black text-slate-900">Late</span></>
                  ) : (
                    <><Calendar className="text-slate-400" size={24} /><span className="text-2xl font-black text-slate-900">Not Marked</span></>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees Card */}
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${totalDue > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          <CardContent className="p-6 flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Fees</p>
              <h2 className={`text-3xl font-black tracking-tight ${totalDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                ৳ {totalDue.toLocaleString()}
              </h2>
              {unpaidVouchers.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">{unpaidVouchers.length} voucher(s) unpaid</p>
              )}
            </div>
            {totalDue > 0 && (
              <Button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                <CreditCard size={16} className="mr-2" /> Pay Online
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Academic Card */}
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <CardContent className="p-6 flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Latest Result</p>
              {latestResult ? (
                <>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">{latestResult.percentage.toFixed(1)}%</h2>
                    {latestResult.grade && <span className="text-lg font-bold text-blue-600">({latestResult.grade})</span>}
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">{latestResult.examType}</p>
                </>
              ) : (
                <div className="flex items-center gap-2 mt-4 text-slate-400">
                  <GraduationCap size={24} />
                  <span className="font-medium text-sm">No results published yet</span>
                </div>
              )}
            </div>
            {latestResult && (
              <Button 
              variant="outline"
              className="w-full mt-4 text-blue-700 border-blue-200 hover:bg-blue-50 bg-white"
              onClick={() => handleDownloadReport(student.id, latestResult.examType, student.fullName)}
              >
              <FileText size={16} className="mr-2" /> Download Report
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}