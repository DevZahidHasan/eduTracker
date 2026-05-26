'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Zap,
  Bell,
  Users,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  ArrowRight,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
  Key,
} from 'lucide-react';
import { selectRole } from '@/lib/features/authSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import Link from 'next/link';
import {
  fetchMarks,
  selectAllMarks,
  selectAverageMarks,
  selectMarksTrendData,
} from '@/lib/features/marksSlice';
import {
  fetchAttendance,
  selectAttendanceTrendData,
  selectAllAttendanceRecords,
  selectOverallAttendanceRate,
  selectAttendanceBreakdownData,
} from '@/lib/features/attendanceSlice';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { selectClasses } from '@/lib/features/configSlice';
import { generateInsights } from '@/lib/features/aiInsightsSlice';
import { Card, CardHeader, CardTitle, CardContent, AnimatedCard } from '@/components/ui/Card';
import { selectSchoolProfile, fetchSchoolProfile } from '@/lib/features/settingsSlice';

// Lazy load Recharts components
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), {
  ssr: false,
});
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });

const STATUS_COLORS: Record<string, string> = {
  Present: '#10b981',
  Absent: '#ef4444',
  Late: '#f59e0b',
  Excused: '#3b82f6',
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const loadingStudents = useAppSelector((state) => state.students.loading);
  const loadingMarks = useAppSelector((state) => state.marks.loading);
  const loadingAttendance = useAppSelector((state) => state.attendance.loading);
  const isInitialLoading = loadingStudents || loadingMarks || loadingAttendance;

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
    dispatch(fetchAttendance());
    dispatch(fetchSchoolProfile());
  }, [dispatch]);

  const allStudents = useAppSelector(selectAllStudents);
  const totalStudents = allStudents.length;
  const userRole = useAppSelector(selectRole);
  const classes = useAppSelector(selectClasses);
  const totalClasses = classes.length;
  const schoolProfile = useAppSelector(selectSchoolProfile);

  const averageMarks = useAppSelector(selectAverageMarks);
  const attendanceRate = useAppSelector(selectOverallAttendanceRate);

  const marksTrendData = useAppSelector(selectMarksTrendData);
  const attendanceBreakdownData = useAppSelector(selectAttendanceBreakdownData);
  const attendanceTrendData = useAppSelector(selectAttendanceTrendData);

  const allMarks = useAppSelector(selectAllMarks);
  const allAttendance = useAppSelector(selectAllAttendanceRecords);
  const { result: aiResult, loading: aiLoading } = useAppSelector((state) => state.aiInsights);
  
  const licenseExpiryDate = useAppSelector((state) => state.license.expiryDate);

  const daysRemaining = useMemo(() => {
    if (!licenseExpiryDate) return null;
    const diff = new Date(licenseExpiryDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [licenseExpiryDate]);

  const handleGenerateInsights = () => {
    dispatch(generateInsights({ marks: allMarks, attendance: allAttendance }));
  };

  // --- Derive Recent Activity ---
  const recentActivities = useMemo(() => {
    interface Activity {
      id: string;
      type: string;
      title: string;
      description: string;
      time: string | undefined;
      icon: React.ReactNode;
      color: string;
      bg: string;
    }
    const activities: Activity[] = [];

    // Add recent students
    const sortedStudents = [...allStudents]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);

    sortedStudents.forEach((s) => {
      activities.push({
        id: `stu-${s.id}`,
        type: 'STUDENT',
        title: 'New Student Registered',
        description: `${s.fullName} was added to ${s.className}`,
        time: s.createdAt,
        icon: <Users size={16} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      });
    });

    // Add recent marks
    const sortedMarks = [...allMarks]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);

    sortedMarks.forEach((m) => {
      const student = allStudents.find((s) => s.id === m.studentId);
      activities.push({
        id: `mark-${m.id}`,
        type: 'MARK',
        title: 'Result Published',
        description: `Marks entered for ${student?.fullName || 'a student'} in ${m.subject}`,
        time: m.createdAt,
        icon: <BookOpen size={16} />,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
      });
    });

    return activities
      .sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
      .slice(0, 5);
  }, [allStudents, allMarks]);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            Institutional Live Console
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {schoolProfile?.name || 'Executive Dashboard'}
          </h1>
          <p className="text-slate-500 font-medium">
            Holistic overview of academic health and operational efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Last Sync
            </span>
            <span className="text-xs font-bold text-slate-700 mt-1">
              Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {userRole === 'ADMIN' && (
            <>
              {/* <Button
                variant="outline"
                size="lg"
                className="rounded-2xl border-slate-200 bg-white shadow-sm font-bold text-xs uppercase tracking-widest px-6"
              >
                <Bell size={16} className="mr-2 text-slate-400" />
                Notifications
              </Button> */}
              <Link href="/staff">
                <Button
                  size="lg"
                  className="rounded-2xl shadow-xl shadow-blue-100 font-black text-xs uppercase tracking-widest px-8"
                >
                  Manage Staff
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isInitialLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-none shadow-xl shadow-slate-200/40 bg-white">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-3 w-24" />
                <div className="flex items-end gap-3">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <Skeleton className="h-1 w-full rounded-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Users size={80} />
              </div>
              <CardContent className="p-6">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Total Enrollment
                </p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 leading-none">
                    {totalStudents}
                  </h2>
                  <span className="text-emerald-500 text-xs font-black mb-1 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                    +4%
                  </span>
                </div>
                <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <LayoutGrid size={80} />
              </div>
              <CardContent className="p-6">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Active Classes
                </p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 leading-none">
                    {totalClasses}
                  </h2>
                  <span className="text-slate-500 text-xs font-black mb-1 flex items-center bg-slate-100 px-2 py-0.5 rounded-full">
                    Operational
                  </span>
                </div>
                <div className="mt-6 flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white bg-slate-200"
                    ></div>
                  ))}
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] font-black text-white">
                    +2
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Calendar size={80} />
              </div>
              <CardContent className="p-6">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Daily Attendance
                </p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 leading-none">
                    {attendanceRate}%
                  </h2>
                  <span className="text-amber-500 text-xs font-black mb-1 flex items-center bg-amber-50 px-2 py-0.5 rounded-full">
                    -0.8%
                  </span>
                </div>
                <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Goal: 95%</span>
                  <span className="text-primary">{attendanceRate}% Current</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={80} />
              </div>
              <CardContent className="p-6">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Avg Performance
                </p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-slate-900 leading-none">
                    {averageMarks}%
                  </h2>
                  <span className="text-emerald-500 text-xs font-black mb-1 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                    +2.1%
                  </span>
                </div>
                <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${averageMarks}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Performance Analytics */}
          <Card className="border-none shadow-xl shadow-slate-200/30 bg-white p-2">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6">
              <div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="text-primary" size={20} />
                  Academic Excellence Trend
                </CardTitle>
                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">
                  Weighted average scoring across all departments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Global Avg
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="h-[360px] w-full mt-4">
                {isInitialLoading ? (
                  <Skeleton className="h-full w-full rounded-3xl" />
                ) : marksTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={marksTrendData}>
                      <defs>
                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight={900}
                        tickLine={false}
                        axisLine={false}
                        dy={15}
                        tickFormatter={(val) =>
                          new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })
                        }
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight={900}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        dx={-15}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow:
                            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ fontWeight: 'black', color: '#0f172a', marginBottom: '4px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="average"
                        stroke="#2563eb"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorPerf)"
                        dot={{ r: 4, fill: '#fff', stroke: '#2563eb', strokeWidth: 3 }}
                        activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl">
                    <TrendingUp size={48} className="mb-4 text-slate-200" />
                    <span className="font-bold text-sm">Aggregating Performance Data...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl shadow-slate-200/30 bg-white">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
                  Attendance Consistency
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Daily presence ratios
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-[240px] w-full">
                  {attendanceTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={attendanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          fontSize={10}
                          fontWeight={900}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={10}
                          fontWeight={900}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 4, 4]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                      Pending Sync
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/30 bg-white">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
                  Status Distribution
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Aggregated presence metrics
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-[240px] w-full">
                  {attendanceBreakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={attendanceBreakdownData.map(entry => ({ ...entry, fill: STATUS_COLORS[entry.name] || '#94a3b8' }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={10}
                          dataKey="value"
                          stroke="none"
                        >
                          {attendanceBreakdownData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            paddingTop: '20px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                      No Records
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Insights & Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Insights - Premium Variant */}
          <Card className="border-none shadow-2xl shadow-indigo-100 bg-indigo-700  text-white overflow-hidden relative">
            <div className="absolute top-[-10%] right-[-10%] h-48 w-48 bg-white/10 rounded-full blur-3xl"></div>
            <CardHeader className="relative z-10 px-6 pt-6">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Sparkles size={20} className="text-amber-300" />
                </div>
                AI Insights Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-8 space-y-6">
              {aiResult ? (
                <div className="text-sm font-medium leading-relaxed bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 italic">
                  {aiResult}
                </div>
              ) : (
                <p className="text-white text-sm font-medium">
                  Deploy our advanced AI models to analyze student performance and identify
                  predictive academic patterns.
                </p>
              )}
              <Button
                onClick={handleGenerateInsights}
                disabled={aiLoading}
                className="w-full bg-indigo-300 text-indigo-700 hover:bg-indigo-50 font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl shadow-lg"
              >
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin"></div>
                    Synthesizing...
                  </div>
                ) : (
                  'Run Performance Analysis'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities Feed */}
          <Card className="border-none shadow-xl shadow-slate-200/40 bg-white">
            <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <div>
                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
                  Recent Activity
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Real-time system updates
                </p>
              </div>
              <Button variant="ghost" size="sm" className="p-2 rounded-xl text-primary">
                <Clock size={18} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {isInitialLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-6 flex gap-4">
                      <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-6 hover:bg-slate-50/50 transition-standard group"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`h-10 w-10 shrink-0 rounded-2xl ${act.bg} ${act.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                        >
                          {act.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-900 leading-none">
                              {act.title}
                            </h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              {act.time
                                ? new Date(act.time).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{act.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 px-6 text-center">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-3 border border-slate-100 border-dashed">
                      <AlertCircle size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No activities today
                    </p>
                  </div>
                )}
              </div>
              {recentActivities.length > 0 && (
                <div className="p-4 bg-slate-50/50 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary"
                  >
                    View System Audit Logs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-3xl space-y-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                Server Health
              </div>
              <p className="text-xs font-bold text-slate-900">Optimal (99.9%)</p>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-3xl space-y-2">
              <Zap className="text-primary" size={18} />
              <div className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                Database
              </div>
              <p className="text-xs font-bold text-slate-900">1.2ms Latency</p>
            </div>
          </div>

          {/* License Status Strip */}
          {userRole === 'ADMIN' && daysRemaining !== null && (
            <div className={`p-4 rounded-3xl flex items-center justify-between border ${daysRemaining <= 30 ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div className="space-y-1">
                <div className={`text-[10px] font-black uppercase tracking-widest leading-none ${daysRemaining <= 30 ? 'text-red-600' : 'text-amber-600'}`}>
                  System License
                </div>
                <p className="text-xs font-bold text-slate-900">{daysRemaining} Days Remaining</p>
              </div>
              <Key className={daysRemaining <= 30 ? 'text-red-500' : 'text-amber-500'} size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
