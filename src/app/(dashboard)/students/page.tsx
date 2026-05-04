'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  selectAllStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  Student
} from '@/lib/features/studentsSlice';
import { selectAllMarks } from '@/lib/features/marksSlice';
import { selectAttendanceSummary } from '@/lib/features/attendanceSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectAllStudents);
  const allMarks = useAppSelector(selectAllMarks);
  const attendanceSummary = useAppSelector(selectAttendanceSummary);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  
  // Marks modal state
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [viewingMarksStudent, setViewingMarksStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((student) => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const studentMarks = useMemo(() => {
    if (!viewingMarksStudent) return [];
    return allMarks.filter((m) => m.studentId === viewingMarksStudent.id);
  }, [allMarks, viewingMarksStudent]);

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentStudent({ name: '', email: '', grade: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudent(id));
    }
  };

  const handleViewMarksClick = (student: Student) => {
    setViewingMarksStudent(student);
    setIsMarksModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.email || !currentStudent.grade) return;

    if (isEditing && currentStudent.id) {
      dispatch(updateStudent(currentStudent as Student));
    } else {
      dispatch(addStudent({
        ...currentStudent,
        id: Math.random().toString(36).substr(2, 9),
      } as Student));
    }
    setIsModalOpen(false);
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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Attendance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-800/30">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentAttendance = attendanceSummary[student.id];
                  const attendancePct = studentAttendance ? studentAttendance.percentage : null;

                  return (
                    <tr key={student.id} className="hover:bg-cyan-900/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                      <td className="px-6 py-4 text-gray-300">{student.email}</td>
                      <td className="px-6 py-4 text-gray-300">
                        <span className="inline-flex items-center rounded-full bg-cyan-950/50 px-2.5 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-800/50">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Full Name"
            placeholder="John Doe"
            value={currentStudent.name || ''}
            onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
            required
          />
          <Input 
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={currentStudent.email || ''}
            onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
            required
          />
          <Input 
            label="Grade/Class"
            placeholder="10A"
            value={currentStudent.grade || ''}
            onChange={(e) => setCurrentStudent({ ...currentStudent, grade: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 mt-4">
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
        title={`Marks for ${viewingMarksStudent?.name || 'Student'}`}
      >
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
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
