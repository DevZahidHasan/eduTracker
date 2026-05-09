'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, FileText } from 'lucide-react';
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
import { Card } from '@/components/ui/Card';
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
  const errorStudents = useAppSelector((state) => state.students.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  
  // Marks modal state
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [viewingMarksStudent, setViewingMarksStudent] = useState<Student | null>(null);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchMarks());
    dispatch(fetchAttendance());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((student) => {
      const fullName = (student.fullName || '').toLowerCase();
      const email = student.email ? student.email.toLowerCase() : '';
      const stdId = student.studentId ? student.studentId.toLowerCase() : '';
      return fullName.includes(searchQuery.toLowerCase()) ||
             email.includes(searchQuery.toLowerCase()) ||
             stdId.includes(searchQuery.toLowerCase());
    });
  }, [students, searchQuery]);

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

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudentThunk(id))
        .unwrap()
        .then(() => toast.success('Student deleted successfully'))
        .catch((err) => toast.error(err || 'Failed to delete student'));
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-neon text-glow">Students Management</h1>
        <Button onClick={handleAddClick} className="flex items-center gap-2">
          <Plus size={18} />
          Add Student
        </Button>
      </div>

      <Card className="flex-1 flex flex-col gap-4 border-cyan-800">
        <div className="flex items-center gap-2 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
          <Input 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-cyan-800/50 bg-black/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-cyan-950/30 text-cyan-400 border-b border-cyan-800/50">
              <tr>
                <th className="px-6 py-4 font-medium">Roll No</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Section</th>
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium text-center">Attendance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-800/30">
              {loadingStudents ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading students...</td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentAttendance = attendanceSummary[student.id];
                  const attendancePct = studentAttendance ? studentAttendance.percentage : null;

                  return (
                    <tr key={student.id} className="hover:bg-cyan-900/10 transition-colors">
                      <td className="px-6 py-4 text-cyan-400 font-mono">{student.rollNumber || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-white">{student.fullName}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {CLASSES.find(c => c.value === student.className)?.label || student.className || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{student.section || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-300">
                        <span className="inline-flex items-center rounded-full bg-cyan-950/50 px-2.5 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-800/50">
                          {student.studentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {attendancePct !== null ? (
                          <span className={`font-medium ${attendancePct >= 80 ? 'text-green-400' : attendancePct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {attendancePct}%
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-3">
                        <button 
                          onClick={() => handleViewMarksClick(student)}
                          className="text-green-500 hover:text-green-400 transition-colors p-1 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          title="View Marks"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(student)}
                          className="text-cyan-500 hover:text-neon transition-colors p-1 hover:glow"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(student.id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-1 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No students found. Try adding a new student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Section 1: Student Information */}
          <div className="bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-800/50 pb-2 mb-2">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input 
                  label="Full Name *"
                  placeholder="John Doe"
                  value={currentStudent.fullName || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Gender *</label>
                <select
                  value={currentStudent.gender || 'MALE'}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
                  required
                  className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300"
                >
                  <option value="" disabled>Select Gender</option>
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
                placeholder="O+"
                value={currentStudent.bloodGroup || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, bloodGroup: e.target.value })}
              />
              <Input 
                label="Profile Image URL"
                placeholder="https://example.com/image.jpg"
                value={currentStudent.profileImage || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, profileImage: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Academic Information */}
          <div className="bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-800/50 pb-2 mb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Student ID *"
                placeholder="STU-001"
                value={currentStudent.studentId || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, studentId: e.target.value })}
                required
              />
              <Input 
                label="Roll Number *"
                placeholder="101"
                value={currentStudent.rollNumber || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, rollNumber: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">Class *</label>
                <select
                  value={currentStudent.className || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, className: e.target.value })}
                  required
                  className="w-full bg-black/40 border border-cyan-800/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-all duration-300"
                >
                  <option value="" disabled>Select a class</option>
                  {CLASSES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Section *"
                placeholder="A"
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

          {/* Section 3: Parent Information */}
          <div className="bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-800/50 pb-2 mb-2">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Parent Name"
                placeholder="Jane Doe"
                value={currentStudent.parentName || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, parentName: e.target.value })}
              />
              <Input 
                label="Parent Phone"
                placeholder="+1234567890"
                value={currentStudent.parentPhone || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, parentPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Section 4: Contact Information */}
          <div className="bg-black/20 backdrop-blur-md border border-cyan-800/50 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-800/50 pb-2 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={currentStudent.email || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              />
              <Input 
                label="Phone Number"
                placeholder="+1234567890"
                value={currentStudent.phone || ''}
                onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input 
                  label="Address"
                  placeholder="123 Main St, City, Country"
                  value={currentStudent.address || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-cyan-800/50 sticky bottom-0 bg-black/40 backdrop-blur-xl pb-2 z-10 -mx-2 px-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title={`Marks for ${viewingMarksStudent ? viewingMarksStudent.fullName : 'Student'}`}
      >
        <div className="flex flex-col gap-4">
          {studentMarks.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-cyan-950/30 text-cyan-400 border-b border-cyan-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium text-right">Score</th>
                  <th className="px-4 py-3 font-medium text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-800/30">
                {studentMarks.map((mark) => {
                  const percentage = Math.round((mark.score / mark.maxScore) * 100);
                  return (
                    <tr key={mark.id} className="hover:bg-cyan-900/10 transition-colors">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(mark.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{mark.subject}</td>
                      <td className="px-4 py-3 text-gray-300 text-right">
                        <span className="text-white font-medium">{mark.score}</span> / {mark.maxScore}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                            percentage >= 80
                              ? 'bg-green-500/10 text-green-400'
                              : percentage >= 60
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
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
          ) : (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
              No marks recorded for this student yet.
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsMarksModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
