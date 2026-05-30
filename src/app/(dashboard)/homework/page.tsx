'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectUser } from '@/lib/features/authSlice';
import { 
  fetchHomeworks, 
  fetchParentHomeworks, 
  createHomeworkThunk, 
  deleteHomeworkThunk,
  updateHomeworkThunk,
  selectHomeworks, 
  selectParentHomeworks, 
  selectHomeworkLoading 
} from '@/lib/features/homeworkSlice';
import { selectClasses, selectSubjects, fetchConfig } from '@/lib/features/configSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Clock,
  Edit3
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function HomeworkPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const homeworks = useAppSelector(selectHomeworks);
  const parentHomeworks = useAppSelector(selectParentHomeworks);
  const loading = useAppSelector(selectHomeworkLoading);
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    subjectName: '',
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    dispatch(fetchConfig());
    if (user?.role === 'PARENT') {
      dispatch(fetchParentHomeworks());
    } else {
      dispatch(fetchHomeworks({}));
    }
  }, [dispatch, user]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateHomeworkThunk({ id: editingId, data: formData })).unwrap();
        toast.success('Homework updated successfully');
      } else {
        await dispatch(createHomeworkThunk(formData)).unwrap();
        toast.success('Homework assigned successfully');
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        className: '',
        section: '',
        subjectName: '',
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error: any) {
      toast.error(error || 'Failed to save homework');
    }
  };

  const handleEdit = (h: any) => {
    setFormData({
      className: h.className,
      section: h.section,
      subjectName: h.subjectName,
      title: h.title,
      description: h.description,
      dueDate: format(new Date(h.dueDate), 'yyyy-MM-dd')
    });
    setEditingId(h.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this homework?')) {
      try {
        await dispatch(deleteHomeworkThunk(id)).unwrap();
        toast.success('Homework deleted');
      } catch (error: any) {
        toast.error(error || 'Failed to delete');
      }
    }
  };

  const renderTeacherView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homework & Assignments</h1>
          <p className="text-sm text-slate-500">Manage daily assignments for your classes</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          {isAdding ? 'Cancel' : <><Plus size={16} /> Assign Homework</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 shadow-lg animate-in slide-in-from-top duration-300">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Homework' : 'Assign New Homework'}</CardTitle>
            <CardDescription>{editingId ? 'Update assignment details' : 'Fill in the details to notify parents and students'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Class"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  options={[{ value: '', label: 'Select Class' }, ...CLASSES]}
                  disabled={!!editingId}
                  required
                />
                <Select
                  label="Section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  options={[
                    { value: '', label: 'Select Section' },
                    { value: 'A', label: 'Section A' },
                    { value: 'B', label: 'Section B' },
                    { value: 'C', label: 'Section C' }
                  ]}
                  disabled={!!editingId}
                  required
                />
                <Select
                  label="Subject"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  options={[{ value: '', label: 'Select Subject' }, ...SUBJECTS]}
                  disabled={!!editingId}
                  required
                />
              </div>
              <Input
                label="Assignment Title"
                placeholder="e.g. Exercise 4.2 Problems 1-10"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Detailed Instructions</label>
                <textarea
                  className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="Describe the homework in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Homework' : 'Assign & Notify Parents'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworks.map((h) => (
          <Card key={h.id} className="group hover:shadow-md transition-all border-slate-200/60 overflow-hidden">
            <div className="h-1.5 bg-primary/40 w-full"></div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest">
                  {h.subjectName}
                </div>
                <div className="flex gap-2">
                  {(user?.role === 'ADMIN' || h.teacherId === user?.id) && (
                    <>
                      <button onClick={() => handleEdit(h)} className="text-slate-300 hover:text-blue-500 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(h.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{h.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4">{h.description}</p>
              
              <div className="space-y-2 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar size={14} />
                  <span>Due: {format(new Date(h.dueDate), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <User size={14} />
                  <span>Class: {h.className}-{h.section}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {homeworks.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
              <BookOpen size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Homework Assigned</h3>
            <p className="text-slate-500 text-sm mt-1">Assignments you create will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Homework & Assignments</h1>
        <p className="text-sm text-slate-500 mt-1">Keep track of your child's daily school tasks</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {parentHomeworks.map((h) => (
          <Card key={h.id} className="border-slate-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{h.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{h.subjectName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class {h.className}-{h.section}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{h.description}</p>
                  </div>
                </div>

                <div className="md:w-64 space-y-4 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                        <p className="text-sm font-bold text-slate-900">{format(new Date(h.dueDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned By</p>
                        <p className="text-sm font-bold text-slate-900">{h.teacher?.name || 'Teacher'}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-xs font-bold">
                    <CheckCircle size={14} className="mr-2" /> Mark as Done
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {parentHomeworks.length === 0 && !loading && (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-300 mb-4">
              <BookOpen size={64} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Active Assignments</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              Your child currently has no pending homework assignments from their teachers.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto pb-12">
      {user?.role === 'PARENT' ? renderParentView() : renderTeacherView()}
    </div>
  );
}
