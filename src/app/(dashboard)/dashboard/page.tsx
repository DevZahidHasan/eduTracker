'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Zap,
  Users,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  AlertCircle,
  CheckCircle2,
  Key,
  UserPlus,
  FileSpreadsheet,
  Wallet,
  GraduationCap
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { selectSchoolProfile, fetchSchoolProfile, fetchUsers, selectUsers } from '@/lib/features/settingsSlice';

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
    dispatch(fetchUsers());
  }, [dispatch]);

  const allStudents = useAppSelector(selectAllStudents);
  const totalStudents = allStudents.length;
  const userRole = useAppSelector(selectRole);
  const classes = useAppSelector(selectClasses);
  const totalClasses = classes.length;
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const staffList = useAppSelector(selectUsers);

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

    const sortedStudents = [...allStudents]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);

    sortedStudents.forEach((s) => {
      activities.push({
        id: `stu-${s.id}`,
        type: 'STUDENT',
        title: 'New Enrollment',
        description: `${s.fullName} registered in ${s.className}`,
        time: s.createdAt,
        icon: <Users size={16} />,
        color: 'text-primary',
        bg: 'bg-primary/10',
      });
    });

    const sortedMarks = [...allMarks]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);

    sortedMarks.forEach((m) => {
      const student = allStudents.find((s) => s.id === m.studentId);
      activities.push({
        id: `mark-${m.id}`,
        type: 'MARK',
        title: 'Academic Update',
        description: `Marks entered for ${student?.fullName || 'student'} in ${m.subject}`,
        time: m.createdAt,
        icon: <BookOpen size={16} />,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
      });
    });

    return activities
      .sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
      .slice(0, 6);
  }, [allStudents, allMarks]);

  // Gender Distribution Data
  const demographicData = useMemo(() => {
    const boys = allStudents.filter(s => s.gender === 'MALE').length;
    const girls = allStudents.filter(s => s.gender === 'FEMALE').length;
    return [
      { name: 'Boys', value: boys, fill: '#3b82f6' },
      { name: 'Girls', value: girls, fill: '#ec4899' },
    ].filter(d => d.value > 0);
  }, [allStudents]);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      
      {/* 1. Command Center Header (Modern Glassmorphic look) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 lg:p-10 shadow-xl shadow-slate-900/20">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Command Center
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight">
              Welcome back, {userRole === 'ADMIN' ? 'Admin' : 'Principal'}
            </h1>
            <p className="text-slate-300 font-medium max-w-xl text-sm lg:text-base leading-relaxed">
              Here is what's happening at <strong className="text-white">{schoolProfile?.name || 'your institution'}</strong> today. Manage operations, analyze academics, and coordinate staff from one place.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shrink-0">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Date & Time</span>
             <span className="text-xl font-black tracking-tight">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
             </span>
             <span className="text-sm font-bold text-slate-300">
               {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>
        </div>

        {/* Quick Action Bar (Integrated into Header bottom) */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center gap-3">
           <Link href="/admissions">
              <Button variant="soft" className="bg-white/10 text-white hover:bg-white/20 border border-white/10 border-b-white/20">
                <UserPlus size={16} className="mr-2" /> Admit Student
              </Button>
           </Link>
           <Link href="/attendance">
              <Button variant="soft" className="bg-white/10 text-white hover:bg-white/20 border border-white/10 border-b-white/20">
                <Calendar size={16} className="mr-2" /> Take Attendance
              </Button>
           </Link>
           <Link href="/marks">
              <Button variant="soft" className="bg-white/10 text-white hover:bg-white/20 border border-white/10 border-b-white/20">
                <FileSpreadsheet size={16} className="mr-2" /> Enter Marks
              </Button>
           </Link>
           {userRole === 'ADMIN' && (
             <Link href="/settings">
                <Button variant="soft" className="bg-white/10 text-white hover:bg-white/20 border border-white/10 border-b-white/20">
                  <Key size={16} className="mr-2" /> System Settings
                </Button>
             </Link>
           )}
        </div>
      </div>

      {/* 2. Bento Box KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isInitialLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border shadow-sm bg-card rounded-3xl h-36">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-3xl overflow-hidden group">
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <Users size={120} />
                </div>
                <div className="flex justify-between items-start">
                   <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.15em]">Total Students</p>
                   <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                     <Users size={14} />
                   </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-4xl font-black text-foreground tracking-tight">{totalStudents}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">Active</span>
                    <span className="text-muted-foreground text-[10px] font-medium">Currently enrolled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-3xl overflow-hidden group">
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <Calendar size={120} />
                </div>
                <div className="flex justify-between items-start">
                   <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.15em]">Daily Attendance</p>
                   <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                     <Calendar size={14} />
                   </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-4xl font-black text-foreground tracking-tight">{attendanceRate}%</h2>
                  <div className="flex items-center gap-2 mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 rounded-full" style={{ width: `${attendanceRate}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-3xl overflow-hidden group">
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <TrendingUp size={120} />
                </div>
                <div className="flex justify-between items-start">
                   <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.15em]">Avg Performance</p>
                   <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                     <TrendingUp size={14} />
                   </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-4xl font-black text-foreground tracking-tight">{averageMarks}%</h2>
                  <div className="flex items-center gap-2 mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${averageMarks}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-3xl overflow-hidden group bg-gradient-to-br from-card to-slate-50 dark:to-slate-900">
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                 <div className="flex justify-between items-start">
                   <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.15em]">Operational Stats</p>
                   <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                     <LayoutGrid size={14} />
                   </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <div>
                     <h3 className="text-2xl font-black text-foreground">{totalClasses}</h3>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Classes</p>
                   </div>
                   <div className="h-8 w-[1px] bg-border"></div>
                   <div>
                     <h3 className="text-2xl font-black text-foreground">{staffList.length}</h3>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Staff</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 3. Main Analytics Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Academic Trend (Large Chart) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border shadow-sm bg-card rounded-3xl p-1">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-lg font-black text-foreground tracking-tight">Academic Trajectory</CardTitle>
                <p className="text-[11px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                  Institution-wide average scoring timeline
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="h-[300px] w-full mt-4">
                {isInitialLoading ? (
                  <Skeleton className="h-full w-full rounded-2xl" />
                ) : marksTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={marksTrendData}>
                      <defs>
                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="var(--muted-foreground)"
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
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        fontWeight={900}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        dx={-15}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ fontWeight: 'black', color: 'var(--foreground)', marginBottom: '4px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="average"
                        name="Avg Score"
                        stroke="var(--primary)"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorPerf)"
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                    <TrendingUp size={32} className="mb-3 opacity-50" />
                    <span className="font-bold text-xs">No academic data available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Chart */}
            <Card className="border-border shadow-sm bg-card rounded-3xl">
              <CardHeader className="px-6 pt-6 pb-2">
                <CardTitle className="text-base font-black text-foreground tracking-tight">Attendance Trend</CardTitle>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Last 7 Days</p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-[200px] w-full">
                  {attendanceTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={attendanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={9} fontWeight={900} tickLine={false} axisLine={false} dy={10} />
                        <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="rate" name="Presence Rate" fill="#10b981" radius={[4, 4, 4, 4]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                     <div className="h-full bg-muted/20 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground font-bold text-xs uppercase">No Data</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Demographics / Status Chart */}
            <Card className="border-border shadow-sm bg-card rounded-3xl">
              <CardHeader className="px-6 pt-6 pb-2">
                <CardTitle className="text-base font-black text-foreground tracking-tight">Student Demographics</CardTitle>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Gender Distribution</p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-[200px] w-full">
                  {demographicData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-muted/20 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground font-bold text-xs uppercase">No Data</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. Side Panel (Insights & Activity) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Engine Card */}
          <Card className="border-none shadow-xl shadow-primary/20 bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden relative rounded-3xl">
            <div className="absolute top-[-20%] right-[-10%] h-40 w-40 bg-white/20 rounded-full blur-3xl"></div>
            <CardHeader className="relative z-10 px-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                  <Sparkles size={18} className="text-blue-100" />
                </div>
                <div>
                   <h3 className="text-base font-black text-white tracking-tight">AI Insights Engine</h3>
                   <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-0.5">Performance Analysis</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-6 space-y-5">
              {aiResult ? (
                <div className="text-sm font-medium leading-relaxed bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10 italic text-blue-50 shadow-inner">
                  "{aiResult}"
                </div>
              ) : (
                <p className="text-blue-100 text-xs font-medium leading-relaxed">
                  Click below to generate a deep-dive analysis of your current academic and attendance metrics using our AI engine.
                </p>
              )}
              <Button
                onClick={handleGenerateInsights}
                disabled={aiLoading}
                className="w-full bg-white text-primary hover:bg-blue-50 font-black uppercase tracking-widest text-[11px] py-4 rounded-xl shadow-lg border-0"
              >
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    Synthesizing...
                  </div>
                ) : (
                  'Generate Insights'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-border shadow-sm bg-card rounded-3xl">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-base font-black text-foreground tracking-tight">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {isInitialLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-2 w-2/3" />
                      </div>
                    </div>
                  ))
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((act, index) => (
                    <div key={act.id} className="relative flex items-start justify-between gap-4 group">
                      <div className={`h-10 w-10 shrink-0 rounded-full ${act.bg} ${act.color} flex items-center justify-center z-10 border-4 border-card`}>
                        {act.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="text-[13px] font-bold text-foreground leading-none mb-1">{act.title}</h4>
                        <p className="text-[11px] text-muted-foreground font-medium leading-snug">{act.description}</p>
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter pt-1 shrink-0">
                         {act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-xs font-bold uppercase">No recent activity</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <div className="flex gap-3">
             <div className="flex-1 bg-card border border-border p-4 rounded-2xl flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">System</p>
                   <p className="text-xs font-bold text-foreground">Operational</p>
                </div>
             </div>
             {userRole === 'ADMIN' && daysRemaining !== null && (
               <div className={`flex-1 bg-card border p-4 rounded-2xl flex items-center gap-3 ${daysRemaining <= 30 ? 'border-red-200' : 'border-border'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${daysRemaining <= 30 ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <Key size={16} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">License</p>
                     <p className={`text-xs font-bold ${daysRemaining <= 30 ? 'text-red-600' : 'text-foreground'}`}>{daysRemaining} Days</p>
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}