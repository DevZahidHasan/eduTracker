'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, FileText, Users, Filter, MoreVertical, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  selectAllStudents, 
  addStudentThunk, 
  updateStudentThunk, 
  deleteStudentThunk,
  fetchStudents,
  Student
} from '@/lib/features/studentsSlice';
import { selectAllMarks, fetchMarks } from '@/lib/features/marksSlice';
import { selectAttendanceSummary, fetchAttendance } from '@/lib/features/attendanceSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { selectClasses, selectGenders } from '@/lib/features/configSlice';

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectAllStudents);
  const allMarks = useAppSelector(selectAllMarks);
  const attendanceSummary = useAppSelector(selectAttendanceSummary);
  const CLASSES = useAppSelector(selectClasses);
  const GENDERS = useAppSelector(selectGenders);
  
  const loadingStudents = useAppSelector((state) => state.students.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Marks modal state
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [viewingMarksStudent, setViewingMarksStudent] = useState<Student | null>(null);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
    dispatch(fetchAttendance());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    let result = students;
    if (searchQuery) {
      result = students.filter((student) => {
        const fullName = (student.fullName || '').toLowerCase();
        const email = student.email ? student.email.toLowerCase() : '';
        const stdId = student.studentId ? student.studentId.toLowerCase() : '';
        return fullName.includes(searchQuery.toLowerCase()) ||
               email.includes(searchQuery.toLowerCase()) ||
               stdId.includes(searchQuery.toLowerCase());
      });
    }
    return result;
  }, [students, searchQuery]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const studentMarks = useMemo(() => {
    if (!viewingMarksStudent) return [];
    return allMarks.filter((m) => m.studentId === viewingMarksStudent.id);
  }, [allMarks, viewingMarksStudent]);

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentStudent({ fullName: '', rollNumber: '', section: '', gender: 'MALE', email: '', studentId: '', className: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudentThunk(id))
        .unwrap()
        .then(() => toast.success('Student deleted successfully'))
        .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to delete student'));
    }
  };

  const handleViewMarksClick = (student: Student) => {
    setViewingMarksStudent(student);
    setIsMarksModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.fullName || !currentStudent.studentId || !currentStudent.rollNumber || !currentStudent.className || !currentStudent.section || !currentStudent.gender) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }

    try {
      if (isEditing && currentStudent.id) {
        await dispatch(updateStudentThunk(currentStudent as Student)).unwrap();
        toast.success('Student profile updated successfully');
      } else {
        await dispatch(addStudentThunk({
          ...currentStudent,
        } as Partial<Student>)).unwrap();
        toast.success('New student added successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : (err?.message || 'An unexpected error occurred');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage student profiles, academic status, and records.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex gap-2">
            <Download size={16} />
            Export CSV
          </Button>
          <Button onClick={handleAddClick} className="flex items-center gap-2 shadow-lg shadow-blue-200">
            <Plus size={18} />
            Add New Student
          </Button>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden flex flex-col p-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name, email, or student ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 transition-standard focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2">
              <Filter size={14} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="p-2 aspect-square">
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Roll No</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Student</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Class Info</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Student ID</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-center">Attendance</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingStudents ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-medium">Fetching students...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => {
                  const studentAttendance = attendanceSummary[student.id];
                  const attendancePct = studentAttendance ? studentAttendance.percentage : null;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-standard group">
                      <td className="px-6 py-4 text-slate-900 font-bold font-mono">{student.rollNumber || '--'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                            {student.fullName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-tight">{student.fullName}</span>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">{student.email || 'No email provided'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold leading-tight">
                            {CLASSES.find(c => c.value === student.className)?.label || student.className || 'N/A'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium mt-0.5">Section {student.section || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                          {student.studentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {attendancePct !== null ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  attendancePct >= 80 ? 'bg-emerald-500' : attendancePct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${attendancePct}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${
                              attendancePct >= 80 ? 'text-emerald-600' : attendancePct >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {attendancePct}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">PENDING</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-standard">
                          <button 
                            onClick={() => handleViewMarksClick(student)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-standard"
                            title="Academic Records"
                          >
                            <FileText size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-standard"
                            title="Edit Profile"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-standard"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-300 border border-slate-100">
                        <Users size={32} />
                      </div>
                      <div className="max-w-[240px]">
                        <h3 className="text-slate-900 font-bold">No students found</h3>
                        <p className="text-slate-500 text-xs mt-1">Try adjusting your search or add a new student to get started.</p>
                      </div>
                      <Button onClick={handleAddClick} variant="outline" size="sm" className="mt-2 border-primary/30 text-primary">
                        Add First Student
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="text-slate-900">{filteredStudents.length}</span> students
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-standard ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-md shadow-blue-100'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Update Student Profile' : 'Register New Student'}
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8 pb-4">
          
          {/* Section 1: Student Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Users size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <Input 
                  label="Full Name *"
                  placeholder="e.g. Johnathan Doe"
                  value={currentStudent.fullName || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Gender *</label>
                <select
                  value={currentStudent.gender || 'MALE'}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-standard shadow-sm"
                >
                  <option value="" disabled>Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Date of Birth"
                type="date"
                value={currentStudent.dateOfBirth ? currentStudent.dateOfBirth.split('T')[0] : ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, dateOfBirth: e.target.value })}
              />
              <Input 
                label="Blood Group"
                placeholder="e.g. O+"
                value={currentStudent.bloodGroup || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, bloodGroup: e.target.value })}
              />
              <Input 
                label="Profile Image URL"
                placeholder="https://images.unsplash.com/..."
                value={currentStudent.profileImage || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, profileImage: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Academic Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Plus size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Academic Records</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Input 
                label="Official Student ID *"
                placeholder="STU-00000"
                value={currentStudent.studentId || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, studentId: e.target.value })}
                required
              />
              <Input 
                label="Class Roll Number *"
                placeholder="e.g. 10"
                value={currentStudent.rollNumber || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, rollNumber: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Assigned Class *</label>
                <select
                  value={currentStudent.className || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, className: e.target.value })}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-standard shadow-sm"
                >
                  <option value="" disabled>Choose a class</option>
                  {CLASSES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Section/Group *"
                placeholder="e.g. A"
                value={currentStudent.section || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, section: e.target.value })}
                required
              />
              <div className="md:col-span-2">
                <Input 
                  label="Admission Date"
                  type="date"
                  value={currentStudent.admissionDate ? currentStudent.admissionDate.split('T')[0] : ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, admissionDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <MoreVertical size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Guardian Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Input 
                label="Parent/Guardian Name"
                placeholder="Jane Doe"
                value={currentStudent.parentName || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, parentName: e.target.value })}
              />
              <Input 
                label="Guardian Contact Number"
                placeholder="+1 000-000-000"
                value={currentStudent.parentPhone || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, parentPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Section 4: Contact Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="h-8 w-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center">
                <Search size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Contact & Communication</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Input 
                label="Personal Email Address"
                type="email"
                placeholder="john@example.com"
                value={currentStudent.email || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              />
              <Input 
                label="Primary Phone Number"
                placeholder="+1 000-000-000"
                value={currentStudent.phone || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input 
                  label="Residential Address"
                  placeholder="Complete street address, city, and zip"
                  value={currentStudent.address || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="px-8 shadow-lg shadow-blue-100">
              {isEditing ? 'Update Records' : 'Confirm Registration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title={`Academic Performance: ${viewingMarksStudent ? viewingMarksStudent.fullName : 'Student'}`}
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {studentMarks.length > 0 ? (
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentMarks.map((mark) => {
                    const percentage = Math.round((mark.score / mark.maxScore) * 100);
                    return (
                      <tr key={mark.id} className="hover:bg-slate-50/50 transition-standard">
                        <td className="px-4 py-4 text-slate-500 font-medium">
                          {new Date(mark.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4 text-slate-900 font-bold">{mark.subject}</td>
                        <td className="px-4 py-4 text-slate-600 text-right font-mono">
                          <span className="text-slate-900 font-bold">{mark.score}</span> / {mark.maxScore}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                              percentage >= 80
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : percentage >= 60
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-red-50 text-red-700 border-red-100'
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
          ) : (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <FileText size={32} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-900 font-bold">No records found</h3>
              <p className="text-slate-500 text-xs mt-1">This student has no graded marks recorded in the system yet.</p>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button type="button" variant="primary" onClick={() => setIsMarksModalOpen(false)} className="px-10">
              Close Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
