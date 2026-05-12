'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchClassesOverview, fetchClassAnalytics, selectClassesOverview, selectClassAnalytics, selectClassesLoading } from '@/lib/features/classesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react';

export default function ClassesPage() {
  const dispatch = useAppDispatch();
  const overview = useAppSelector(selectClassesOverview);
  const analytics = useAppSelector(selectClassAnalytics);
  const loading = useAppSelector(selectClassesLoading);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchClassesOverview());
    dispatch(fetchClassAnalytics());
  }, [dispatch]);

  const filteredClasses = overview.filter(c => 
    c.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && overview.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading classes...</p>
        </div>
      </div>
    );
  }

  const overallAttendance = analytics?.trends.length 
    ? Math.round(analytics.trends.reduce((acc, t) => acc + t.attendanceRate, 0) / analytics.trends.length) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes Management</h1>
          <p className="text-muted-foreground">Monitor class performance, attendance, and routines across all sections.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.topClass?.replace('_', ' ') || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">Highest average marks</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.weakestClass?.replace('_', ' ') || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">Lowest performance trends</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance}%</div>
            <p className="text-xs text-muted-foreground mt-1">Daily average attendance</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered academic classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {filteredClasses.length} classes
          </p>
        </div>
      </div>

      {/* Class List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((c) => (
            <Card key={c.className} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-2 bg-primary" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{c.className.replace('_', ' ')}</CardTitle>
                    <p className="text-sm text-muted-foreground">{c.sections.length} Sections</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                    {c.totalStudents} STUDENTS
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-1 text-center border-r border-muted">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Attendance</p>
                    <p className="text-xl font-bold text-blue-600">{c.attendancePercentage}%</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Avg Marks</p>
                    <p className="text-xl font-bold text-green-600">{c.averageMarks}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Sections</p>
                  <div className="divide-y divide-muted/50">
                    {c.sections.map((s) => (
                      <div key={s.section} className="py-3 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-bold text-lg">
                            {s.section}
                          </span>
                          <div>
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.teacher}</p>
                            <p className="text-xs text-muted-foreground">{s.studentCount} Students</p>
                          </div>
                        </div>
                        <Link href={`/classes/${c.className}/${s.section}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] rounded-full hover:bg-primary hover:text-white transition-all">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-muted/20 rounded-xl border-2 border-dashed">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-muted-foreground">No classes found</h3>
            <p className="text-sm text-muted-foreground/60">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
