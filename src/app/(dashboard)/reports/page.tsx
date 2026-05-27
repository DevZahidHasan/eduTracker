'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  Printer,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchStudentReport, 
  fetchClassPerformance, 
  fetchAttendanceSummary,
  selectStudentReport,
  selectClassPerformance,
  selectAttendanceSummary,
  selectReportsLoading,
  updateRemarks,
  clearAllReports
} from '@/lib/features/reportsSlice';
import { selectSchoolProfile, fetchSchoolProfile } from '@/lib/features/settingsSlice';
import { selectClasses, selectExamTypes, fetchConfig } from '@/lib/features/configSlice';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const CLASSES = useAppSelector(selectClasses);
  const EXAM_TYPES = useAppSelector(selectExamTypes);
  const students = useAppSelector(selectAllStudents);
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const studentReport = useAppSelector(selectStudentReport);
  const classPerformance = useAppSelector(selectClassPerformance);
  const attendanceSummary = useAppSelector(selectAttendanceSummary);
  const loading = useAppSelector(selectReportsLoading);

  const [activeTab, setActiveTab] = useState<'report-card' | 'attendance' | 'performance'>('report-card');
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');

  useEffect(() => {
    dispatch(clearAllReports()); // Clear on mount
    dispatch(fetchConfig());
    dispatch(fetchStudents());
    dispatch(fetchSchoolProfile());

    return () => {
      dispatch(clearAllReports()); // Clear on unmount
    };
  }, [dispatch]);

  // Clear reports when filters change to avoid showing old data
  useEffect(() => {
    dispatch(clearAllReports());
  }, [selectedClass, selectedExamType, selectedStudentId, activeTab, dispatch]);

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return students;
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const handleFetchReport = () => {
    if (!selectedStudentId || !selectedExamType) {
      toast.error('Please select both a student and an exam type');
      return;
    }
    dispatch(fetchStudentReport({ studentId: Number(selectedStudentId), examType: selectedExamType }));
  };

  const handleFetchPerformance = () => {
    if (!selectedClass || !selectedExamType) {
      toast.error('Please select both a class and an exam type');
      return;
    }
    dispatch(fetchClassPerformance({ className: selectedClass, examType: selectedExamType }));
  };

  const handleFetchAttendance = () => {
    dispatch(fetchAttendanceSummary({ className: selectedClass || undefined }));
  };

  const handleUpdateRemarks = (remarks: string) => {
    if (!selectedStudentId || !selectedExamType) return;
    dispatch(updateRemarks({ 
      studentId: Number(selectedStudentId), 
      examType: selectedExamType, 
      remarks 
    })).unwrap().then(() => toast.success('Remarks updated'));
  };

  const auth = useAppSelector((state: any) => state.auth);
  const token = auth.token;

  const handleDownloadPDF = () => {
    if (!selectedStudentId || !selectedExamType) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const url = `${baseUrl}/reports/export/${selectedStudentId}/${selectedExamType}?token=${token}`;
    window.open(url, '_blank');
  };

  const handleBulkExport = () => {
    if (!selectedClass || !selectedExamType) {
      toast.error('Please select both a class and an exam type');
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const url = `${baseUrl}/reports/export-bulk/${selectedClass}/${selectedExamType}?token=${token}`;
    window.open(url, '_blank');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hide controls when printing */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reporting Center</h1>
            <p className="text-slate-500 font-medium mt-1">Generate and export comprehensive academic insights.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'report-card' && (
              <>
                <Button 
                  onClick={async () => {
                    if (!selectedStudentId) {
                      toast.error('Please select a student first');
                      return;
                    }
                    try {
                      setIsLoadingReport(true);
                      await api.post(`/reports/annual-result/${selectedStudentId}`);
                      toast.success('Annual Result calculated successfully');
                      setSelectedExamType('Annual Result');
                      // Use the Redux thunk instead of a non-existent local setter
                      await dispatch(fetchStudentReport({ 
                        studentId: Number(selectedStudentId), 
                        examType: 'Annual Result' 
                      })).unwrap();
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || 'Failed to calculate Annual Result');
                    } finally {
                      setIsLoadingReport(false);
                    }
                  }} 
                  variant="soft" 
                  className="flex gap-2"
                  disabled={!selectedStudentId || isLoadingReport}
                >
                  <TrendingUp size={16} />
                  <span className="hidden sm:inline">Compile Annual Result</span>
                </Button>
                {studentReport && (
                  <Button onClick={handleDownloadPDF} variant="outline" className="flex gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 shadow-sm">
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span> PDF
                  </Button>
                )}
                <Button onClick={handleBulkExport} variant="outline" className="flex gap-2 border-slate-200 hover:bg-slate-50 shadow-sm">
                  <Download size={16} />
                  Bulk Export
                </Button>
              </>
            )}
            <Button onClick={() => window.print()} className="flex items-center gap-2 shadow-lg shadow-blue-200">
              <Printer size={18} />
              <span className="hidden sm:inline">Print View</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-max">
          {[
            { id: 'report-card', label: 'Report Cards', icon: FileText },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'performance', label: 'Performance', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Card */}
        <Card className="border-slate-200/60 shadow-sm">
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Grade / Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:ring-4 focus:ring-primary/5 outline-none transition-standard"
              >
                <option value="">All Classes</option>
                {CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {activeTab === 'report-card' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:ring-4 focus:ring-primary/5 outline-none transition-standard"
                >
                  <option value="">Choose Student</option>
                  {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>)}
                </select>
              </div>
            )}

            {(activeTab === 'report-card' || activeTab === 'performance') && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Exam Type</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:ring-4 focus:ring-primary/5 outline-none transition-standard"
                >
                  <option value="">Select Assessment</option>
                  {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            )}

            <Button 
              onClick={
                activeTab === 'report-card' ? handleFetchReport : 
                activeTab === 'performance' ? handleFetchPerformance : 
                handleFetchAttendance
              }
              className="h-10 w-full md:w-auto"
            >
              <Filter size={16} className="mr-2" />
              Generate Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 print:hidden">
            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Compiling Data...</p>
          </div>
        ) : activeTab === 'report-card' && studentReport ? (
          // --- FORMAL REPORT CARD LAYOUT ---
          <div className="flex justify-center bg-slate-100 print:bg-white p-8 print:p-0 rounded-2xl">
            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none p-[15mm] border border-slate-200 print:border-none relative flex flex-col">
              
              {/* Document Header with Professional Branding */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
                {schoolProfile?.logo ? (
                  <img src={schoolProfile.logo} alt="School Logo" className="h-20 w-auto object-contain" />
                ) : (
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 print:hidden">
                    <span className="text-[10px] text-slate-300 font-black uppercase">Logo</span>
                  </div>
                )}
                
                <div className="flex-1 text-center px-4">
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
                    {schoolProfile?.name || 'EduTrack Academy'}
                  </h1>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {schoolProfile?.address && <span>{schoolProfile.address}</span>}
                    {schoolProfile?.phone && <span>Tel: {schoolProfile.phone}</span>}
                    {schoolProfile?.email && <span>Email: {schoolProfile.email}</span>}
                    {schoolProfile?.website && <span>Web: {schoolProfile.website}</span>}
                  </div>
                </div>

                <div className="w-20 h-20 opacity-0 hidden sm:block" aria-hidden="true" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-primary uppercase tracking-[0.2em] underline underline-offset-8">Official Academic Report</h2>
                <p className="text-xs font-black text-slate-400 mt-3 uppercase">Assessment: {selectedExamType.replace('_', ' ')} • Session {schoolProfile?.academicYear || '2026'}</p>
              </div>

              {/* Student Information Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Student Name</span>
                  <span className="font-black text-slate-900 text-sm">{studentReport.student.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Student ID</span>
                  <span className="font-bold text-slate-900 text-sm">{studentReport.student.studentId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Class & Section</span>
                  <span className="font-bold text-slate-900 text-sm">{studentReport.student.className} - {studentReport.student.section}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Roll Number</span>
                  <span className="font-bold text-slate-900 text-sm">{studentReport.student.rollNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Date of Issue</span>
                  <span className="font-bold text-slate-900 text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-slate-500 text-sm">Attendance</span>
                  <span className="font-bold text-slate-900 text-sm">{studentReport.attendanceRate}%</span>
                </div>
              </div>

              {/* Academic Performance Table */}
              <div className="mb-8 overflow-x-auto custom-scrollbar">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-3">Academic Performance</h3>
                <table className="w-full text-sm border-collapse border border-slate-800 whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-800 p-2 text-left font-bold text-slate-900">Subject</th>
                      
                      {/* Dynamic Term Columns for Annual Report */}
                      {selectedExamType === 'Annual Result' && (studentReport as any).contributingTerms?.map((term: any) => (
                        <th key={term.value} className="border border-slate-800 p-2 text-center font-bold text-slate-900 w-24">
                          {term.label}
                        </th>
                      ))}

                      {selectedExamType !== 'Annual Result' && <th className="border border-slate-800 p-2 text-center font-bold text-slate-900 w-24">Full Marks</th>}
                      <th className="border border-slate-800 p-2 text-center font-bold text-slate-900 w-24">
                        {selectedExamType === 'Annual Result' ? 'Annual Average' : 'Marks Obtained'}
                      </th>
                      <th className="border border-slate-800 p-2 text-center font-bold text-slate-900 w-24">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentReport.marks.map((mark) => (
                      <tr key={mark.id}>
                        <td className="border border-slate-800 p-2 font-semibold text-slate-800">{mark.subject}</td>
                        
                        {/* Dynamic Score Cells for Annual Report */}
                        {selectedExamType === 'Annual Result' && (studentReport as any).contributingTerms?.map((term: any) => (
                          <td key={term.value} className="border border-slate-800 p-2 text-center text-slate-600 font-medium">
                            {(mark as any).termScores?.[term.value] ?? '-'}
                          </td>
                        ))}

                        {selectedExamType !== 'Annual Result' && <td className="border border-slate-800 p-2 text-center text-slate-600">{mark.maxScore}</td>}
                        <td className="border border-slate-800 p-2 text-center font-bold text-slate-900">{mark.score}</td>
                        <td className="border border-slate-800 p-2 text-center font-bold text-slate-900">
                          {mark.grade}
                        </td>
                      </tr>
                    ))}
                    {studentReport.marks.length === 0 && (
                      <tr>
                        <td colSpan={selectedExamType === 'Annual Result' ? 3 + ((studentReport as any).contributingTerms?.length || 0) : 4} className="border border-slate-800 p-4 text-center text-slate-500 italic">
                          No marks recorded for this exam type.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <th colSpan={selectedExamType === 'Annual Result' ? 1 + ((studentReport as any).contributingTerms?.length || 0) : 2} className="border border-slate-800 p-2 text-right font-black text-slate-900 uppercase">Grade Point Average (GPA)</th>
                      <th colSpan={2} className="border border-slate-800 p-2 text-center font-black text-slate-900 text-lg">
                        {studentReport.gpa.toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Teacher Remarks - Editable on screen, static on print */}
              <div className="mb-16">
                 <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">Class Teacher's Remarks</h3>
                 <textarea 
                    defaultValue={studentReport.teacherRemarks}
                    onBlur={(e) => handleUpdateRemarks(e.target.value)}
                    placeholder="Click to enter official remarks before printing..."
                    className="w-full min-h-[80px] p-0 text-sm text-slate-800 bg-transparent border-b border-dashed border-slate-400 focus:border-primary focus:ring-0 resize-none outline-none print:border-none print:resize-none"
                 />
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-auto pt-12 pb-12">
                <div className="text-center w-48">
                  <div className="border-t border-slate-800 pt-2 font-bold text-slate-800 text-sm">Class Teacher</div>
                </div>
                <div className="text-center w-48">
                  <div className="border-t border-slate-800 pt-2 font-bold text-slate-800 text-sm">Principal</div>
                </div>
                <div className="text-center w-48">
                  <div className="border-t border-slate-800 pt-2 font-bold text-slate-800 text-sm">Guardian</div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-slate-400 font-medium border-t border-slate-100 pt-4 pb-2 print:pb-0">
                This is a computer-generated document by EduTrack AI.
              </div>

            </div>
          </div>
        ) : activeTab === 'attendance' && attendanceSummary.length > 0 ? (
          // ... (Rest of the file remains unchanged for Attendance and Performance tabs)
          <div className="print:hidden">
            <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0">
               <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-slate-900">Attendance Summary Matrix</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(attendanceSummary, 'attendance_report')}>
                    <Download size={14} className="mr-2" /> Export CSV
                  </Button>
               </CardHeader>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Student Name</th>
                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Roll No</th>
                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Class</th>
                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-right">Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendanceSummary.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{s.fullName}</td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-500">{s.rollNumber}</td>
                          <td className="px-6 py-4 font-bold text-slate-400">{s.className}-{s.section}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${s.attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${s.attendanceRate}%` }}
                                  />
                                </div>
                                <span className="font-black text-slate-900">{s.attendanceRate}%</span>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </Card>
          </div>
        ) : activeTab === 'performance' && classPerformance ? (
          <div className="space-y-6 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0">
                  <CardHeader className="bg-emerald-50 border-b border-emerald-100 p-6">
                    <CardTitle className="text-emerald-900 flex items-center gap-2">
                      <TrendingUp size={20} />
                      Top Performing Students
                    </CardTitle>
                  </CardHeader>
                  <div className="divide-y divide-slate-50">
                    {classPerformance.topStudents.map((s, idx) => (
                      <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">{idx + 1}</span>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: {s.rollNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-600">GPA {s.gpa.toFixed(2)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.totalScore} Points</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </Card>

               <Card className="border-slate-200/60 shadow-sm overflow-hidden p-0">
                  <CardHeader className="bg-red-50 border-b border-red-100 p-6">
                    <CardTitle className="text-red-900 flex items-center gap-2">
                      <TrendingUp size={20} className="rotate-180" />
                      Critical Performance (Weak)
                    </CardTitle>
                  </CardHeader>
                  <div className="divide-y divide-slate-50">
                    {classPerformance.weakStudents.map((s, idx) => (
                      <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="h-6 w-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-black text-xs">{idx + 1}</span>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: {s.rollNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-red-600">GPA {s.gpa.toFixed(2)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.totalScore} Points</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </Card>
            </div>

            <Card className="bg-primary p-8 text-white">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Class Overview Stats</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Analytical Summary</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-12">
                    <div className="text-center">
                      <p className="text-5xl font-black tracking-tighter">{classPerformance.classAverageGPA.toFixed(2)}</p>
                      <p className="text-primary-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-2">Class Avg GPA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-black tracking-tighter">{classPerformance.totalStudents}</p>
                      <p className="text-primary-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-2">Evaluated Students</p>
                    </div>
                  </div>
               </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center print:hidden">
            <div className="p-8 bg-slate-50 rounded-full border border-slate-100 mb-6 text-slate-200">
               <BarChart3 size={64} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Ready to Analyze</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-[320px]">Select your parameters in the filter above to generate high-fidelity reports.</p>
          </div>
        )}
      </div>
    </div>
  );
}
