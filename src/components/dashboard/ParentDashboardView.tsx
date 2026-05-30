import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchParentDashboard, 
  selectParentDashboardData, 
  selectParentLoading, 
  fetchParentResults, 
  selectParentResultsData, 
  selectParentResultsLoading, 
  fetchParentAttendance,
  selectParentAttendanceData,
  selectParentAttendanceLoading,
  ParentDashboardData 
} from '@/lib/features/parentSlice';
import { 
  fetchParentHomeworks, 
  selectParentHomeworks 
} from '@/lib/features/homeworkSlice';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen
} from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

export default function ParentDashboardView() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectParentLoading);
  const dashboardData = useAppSelector(selectParentDashboardData);
  const resultsData = useAppSelector(selectParentResultsData);
  const resultsLoading = useAppSelector(selectParentResultsLoading);
  const attendanceData = useAppSelector(selectParentAttendanceData);
  const attendanceLoading = useAppSelector(selectParentAttendanceLoading);
  const parentHomeworks = useAppSelector(selectParentHomeworks);
  
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    dispatch(fetchParentDashboard());
    dispatch(fetchParentHomeworks());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(dashboardData[0].student.id);
    }
  }, [dashboardData, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(fetchParentResults({ studentId: selectedStudentId }));
      
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      dispatch(fetchParentAttendance({ 
        studentId: selectedStudentId, 
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd')
      }));
    }
  }, [selectedStudentId, currentMonth, dispatch]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getAttendanceForDay = (day: Date) => {
    return attendanceData.find(a => isSameDay(new Date(a.date), day));
  };

  const currentHomeworks = parentHomeworks.filter(h => {
    const studentData = dashboardData.find(d => d.student.id === selectedStudentId);
    return h.className === studentData?.student.className && h.section === studentData?.student.section;
  }).slice(0, 3);

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
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden md:col-span-3 lg:col-span-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <CardContent className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Latest Result</p>
                {latestResult && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{latestResult.examType}</span>}
              </div>
              
              {latestResult ? (
                <>
                  <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-slate-100">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">{latestResult.percentage.toFixed(1)}%</h2>
                    {latestResult.grade && <span className="text-lg font-bold text-blue-600">({latestResult.grade})</span>}
                  </div>
                  
                  {latestResult.marks && latestResult.marks.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {latestResult.marks.map((mark, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{mark.subject}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{mark.score}</span>
                            <span className="text-xs text-slate-400">/ {mark.maxScore}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Attendance Calendar & Recent Results Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Attendance Calendar */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Attendance Calendar</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm font-bold text-slate-700 min-w-[100px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}
              </div>

              {attendanceLoading ? (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    const att = getAttendanceForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    
                    let bgColor = 'bg-slate-50';
                    let textColor = 'text-slate-400';
                    
                    if (isCurrentMonth) {
                      textColor = 'text-slate-700';
                      if (att) {
                        if (att.status === 'PRESENT') bgColor = 'bg-emerald-500 text-white';
                        else if (att.status === 'ABSENT') bgColor = 'bg-red-500 text-white';
                        else if (att.status === 'LATE') bgColor = 'bg-amber-500 text-white';
                        else if (att.status === 'EXCUSED') bgColor = 'bg-blue-500 text-white';
                      } else {
                        bgColor = 'bg-white border border-slate-100';
                      }
                    } else {
                      bgColor = 'bg-slate-50/50 opacity-40';
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`h-10 sm:h-12 flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all ${bgColor} ${textColor} relative group`}
                      >
                        {format(day, 'd')}
                        {att?.remarks && (
                          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white/50"></div>
                        )}
                        {att && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-xl">
                            {att.status} {att.remarks ? `• ${att.remarks}` : ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-4 justify-center border-t border-slate-50 pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Absent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Late</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Excused</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results List (Side by side with Calendar) */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <GraduationCap className="text-blue-500" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Historical Results</h3>
          </div>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[480px] custom-scrollbar">
            {resultsLoading ? (
              <div className="h-full flex items-center justify-center p-12">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : resultsData && resultsData.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {resultsData.map((res, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                        {res.grade || 'N/A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {res.examType} • {res.percentage.toFixed(1)}% Score
                        </p>
                      </div>
                    </div>
                    {res.canDownload && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => handleDownloadReport(student.id, res.examType, student.fullName)}
                      >
                        <Download size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No history found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Homework Preview Row */}
      <div className="mt-6">
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <BookOpen className="text-amber-500" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Pending Homework</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5" onClick={() => window.location.href='/homework'}>
              View All <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
          <CardContent className="p-0">
            {currentHomeworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {currentHomeworks.map((h, idx) => (
                  <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded uppercase tracking-widest">
                        {h.subjectName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Due: {format(new Date(h.dueDate), 'MMM dd')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-1">{h.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{h.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No pending assignments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance Chart */}
      {resultsData && resultsData.length > 0 && (
        <Card className="border-slate-200/60 shadow-sm mt-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Academic Performance History</h3>
            </div>
            
            {resultsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={resultsData.map(r => ({ name: r.title, Percentage: parseFloat(r.percentage.toFixed(1)) }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      domain={[0, 100]}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Percentage" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPercentage)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}