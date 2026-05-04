"use client";

import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { selectTotalStudents } from '@/lib/features/studentsSlice';
import { selectAverageMarks, selectMarksTrendData } from '@/lib/features/marksSlice';
import { 
  selectOverallAttendanceRate, 
  selectAttendanceBreakdownData, 
  selectAttendanceTrendData 
} from '@/lib/features/attendanceSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6'];

export default function DashboardPage() {
  // --- Metrics & Charts Data from Redux Selectors ---
  const totalStudents = useAppSelector(selectTotalStudents);
  const averageMarks = useAppSelector(selectAverageMarks);
  const attendanceRate = useAppSelector(selectOverallAttendanceRate);
  
  const marksTrendData = useAppSelector(selectMarksTrendData);
  const attendanceBreakdownData = useAppSelector(selectAttendanceBreakdownData);
  const attendanceTrendData = useAppSelector(selectAttendanceTrendData);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-neon text-glow">Dashboard</h1>
        <p className="text-gray-400">Overview of student performance and attendance.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-cyan-800 bg-black/50 hover:border-cyan-500 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyan-400 font-medium mb-1">Total Students</p>
              <h2 className="text-4xl font-bold text-white">{totalStudents}</h2>
            </div>
            <div className="p-4 bg-cyan-950/50 rounded-xl text-cyan-400">
              <Users size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-800 bg-black/50 hover:border-cyan-500 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyan-400 font-medium mb-1">Average Marks</p>
              <h2 className="text-4xl font-bold text-white">{averageMarks}%</h2>
            </div>
            <div className="p-4 bg-cyan-950/50 rounded-xl text-cyan-400">
              <BookOpen size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-800 bg-black/50 hover:border-cyan-500 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyan-400 font-medium mb-1">Attendance Rate</p>
              <h2 className="text-4xl font-bold text-white">{attendanceRate}%</h2>
            </div>
            <div className="p-4 bg-cyan-950/50 rounded-xl text-cyan-400">
              <Calendar size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Marks Trend Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-500" />
              Marks Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {marksTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marksTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f2937', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      name="Average Marks (%)" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                  Not enough marks data to display.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Attendance Trend */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-cyan-500" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {attendanceTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f2937', borderRadius: '8px' }}
                      cursor={{ fill: '#1f2937' }}
                    />
                    <Bar dataKey="rate" name="Attendance Rate (%)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                  Not enough attendance data to display.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Breakdown Chart */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-cyan-500" />
              Overall Attendance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {attendanceBreakdownData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {attendanceBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f2937', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                  No attendance data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
