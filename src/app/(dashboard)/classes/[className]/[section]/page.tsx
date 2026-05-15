'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchSectionDetail, selectSectionDetail, selectClassesLoading, updateSection, updateRoutine } from '@/lib/features/classesSlice';
import { addStudentThunk } from '@/lib/features/studentsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { selectTeachers, fetchConfig, selectSubjects } from '@/lib/features/configSlice';
import { toast } from 'react-hot-toast';
import { RoutineEditorModal } from '../../RoutineEditorModal';
import { StudentFormData } from '@/lib/validations';
import { StudentForm } from '@/components/students/StudentForm';
import { 
  Users, 
  Calendar, 
  User, 
  ArrowLeft,
  Clock,
  Search,
  Edit2,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function SectionDetailPage() {
  const { className, section } = useParams() as { className: string, section: string };
  const dispatch = useAppDispatch();
  const detail = useAppSelector(selectSectionDetail);
  const loading = useAppSelector(selectClassesLoading);
  const teachers = useAppSelector(selectTeachers);
  const subjects = useAppSelector(selectSubjects);
  
  const [activeTab, setActiveTab] = useState<'roster' | 'routine'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchSectionDetail({ className, section }));
    dispatch(fetchConfig());
  }, [dispatch, className, section]);

  useEffect(() => {
    if (detail?.teacherId) {
      setSelectedTeacherId(detail.teacherId.toString());
    }
  }, [detail]);

  const handleUpdateTeacher = async () => {
    try {
      await dispatch(updateSection({ 
        className, 
        section, 
        teacherId: selectedTeacherId ? Number(selectedTeacherId) : null 
      })).unwrap();
      toast.success('Teacher assigned successfully');
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error || 'Failed to assign teacher');
    }
  };

  const handleSaveRoutine = async (routines: any[]) => {
    try {
      await dispatch(updateRoutine({ className, section, routines })).unwrap();
      toast.success('Routine updated successfully');
      setIsRoutineModalOpen(false);
      dispatch(fetchSectionDetail({ className, section })); // Refresh data
    } catch (error: any) {
      toast.error(error || 'Failed to update routine');
    }
  };

  const onAddStudent = async (data: StudentFormData) => {
    try {
      await dispatch(addStudentThunk(data)).unwrap();
      toast.success('Student added successfully');
      setIsAddStudentModalOpen(false);
      dispatch(fetchSectionDetail({ className, section })); // Refresh list
    } catch (error: any) {
      toast.error(error || 'Failed to add student');
    }
  };

  if (loading && !detail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-500">Section not found</h2>
        <Link href="/classes" className="text-primary hover:underline mt-4 inline-block">Back to classes</Link>
      </div>
    );
  }

  const filteredStudents = detail.students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.includes(searchTerm)
  );

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/classes">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{className.replace('_', ' ')} <span className="text-primary">Section {section}</span></h1>
          <div className="flex items-center gap-4 mt-1">
             <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Teacher: <span className="font-semibold text-foreground">{detail.teacher?.name || 'Unassigned'}</span></span>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="ml-1 p-1 hover:bg-muted rounded-full text-primary transition-colors"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground border-l pl-4">
              <Users className="h-4 w-4" />
              <span>{detail.students.length} Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Assignment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Assign Class Teacher"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a teacher</option>
              {teachers.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              This teacher will be the primary contact and administrator for this section.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTeacher}>Save Assignment</Button>
          </div>
        </div>
      </Modal>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'roster' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Student Roster
        </button>
        <button
          onClick={() => setActiveTab('routine')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'routine' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Class Routine
        </button>
      </div>

      {activeTab === 'roster' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, ID or roll..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="hidden sm:flex">
                <Users className="h-4 w-4 mr-2" />
                Manage Roster
              </Button>
              <Button size="sm" onClick={() => setIsAddStudentModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="px-6 py-4 font-bold">Roll</th>
                    <th className="px-6 py-4 font-bold">Student ID</th>
                    <th className="px-6 py-4 font-bold">Full Name</th>
                    <th className="px-6 py-4 font-bold">Gender</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 font-bold text-primary">{student.rollNumber}</td>
                      <td className="px-6 py-4 font-medium">{student.studentId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {student.fullName.charAt(0)}
                          </div>
                          <span className="font-semibold">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{student.gender}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/students/${student.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 group-hover:bg-primary group-hover:text-white">View Profile</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />
                <p>No students found in this section</p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Weekly Schedule</h3>
            <Button size="sm" onClick={() => setIsRoutineModalOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Edit Routine
            </Button>
          </div>

          <RoutineEditorModal
            isOpen={isRoutineModalOpen}
            onClose={() => setIsRoutineModalOpen(false)}
            onSave={handleSaveRoutine}
            initialRoutines={detail.routines}
            subjects={subjects}
            teachers={teachers}
          />

          <div className="grid gap-6">
            {days.map((day) => {
              const routine = detail.routines.find(r => r.dayOfWeek === day);
              return (
                <Card key={day} className="border-none shadow-sm">
                  <CardHeader className="py-3 bg-muted/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {routine && routine.periods.length > 0 ? (
                      <div className="divide-y divide-muted/50">
                        {routine.periods.map((period: any) => (
                          <div key={period.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="text-sm font-bold text-muted-foreground w-20 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {period.startTime}
                              </div>
                              <div className="w-[1px] h-10 bg-muted"></div>
                              <div>
                                <p className="font-bold text-primary">{period.subjectId}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <User className="h-3 w-3" />
                                  {period.teacher?.name || 'Unknown Teacher'}
                                </p>
                              </div>
                            </div>
                            <div className="text-[10px] font-bold bg-secondary px-2 py-1 rounded text-secondary-foreground">
                              PERIOD {period.periodNumber || '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground italic">
                        No classes scheduled for this day
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <Modal 
        isOpen={isAddStudentModalOpen} 
        onClose={() => setIsAddStudentModalOpen(false)}
        title={`Register Student: ${className.replace('_', ' ')} Sec ${section}`}
        className="max-w-3xl"
      >
        <StudentForm 
          key={isAddStudentModalOpen ? 'open' : 'closed'}
          onSubmit={onAddStudent}
          onCancel={() => setIsAddStudentModalOpen(false)}
          initialData={{ className, section }}
          hideClassAndSection={true}
        />
      </Modal>
    </div>
  );
}
