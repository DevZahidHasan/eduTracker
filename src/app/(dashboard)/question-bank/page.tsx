'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchBankQuestions, 
  selectAllBankQuestions, 
  selectQuestionBankLoading,
  deleteBankQuestion,
  createBankQuestion,
  updateBankQuestion
} from '@/lib/features/questionBankSlice';
import { 
  fetchConfig, selectClasses, selectSubjects 
} from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { BankQuestion, BankQuestionFormData } from '@/types/question-bank';

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice (MCQ)' },
  { value: 'SHORT_ANSWER', label: 'Short Answer' },
  { value: 'LONG_ANSWER', label: 'Long Answer' },
  { value: 'TRUE_FALSE', label: 'True / False' },
  { value: 'FILL_IN_BLANKS', label: 'Fill in the Blanks' },
];

export default function QuestionBankPage() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectAllBankQuestions);
  const loading = useAppSelector(selectQuestionBankLoading);
  
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<BankQuestion | null>(null);

  // Form State
  const [formData, setFormData] = useState<BankQuestionFormData>({
    className: '',
    subject: '',
    chapter: '',
    questionType: 'SHORT_ANSWER',
    questionText: '',
    marks: 1,
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    dispatch(fetchBankQuestions());
    dispatch(fetchConfig());
  }, [dispatch]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.questionText.toLowerCase().includes(search.toLowerCase());
      const matchesClass = classFilter ? q.className === classFilter : true;
      const matchesSubject = subjectFilter ? q.subject === subjectFilter : true;
      const matchesChapter = chapterFilter ? q.chapter?.toLowerCase().includes(chapterFilter.toLowerCase()) : true;
      return matchesSearch && matchesClass && matchesSubject && matchesChapter;
    });
  }, [questions, search, classFilter, subjectFilter, chapterFilter]);

  const openAddModal = () => {
    setSelectedQuestion(null);
    setFormData({
      className: '',
      subject: '',
      chapter: '',
      questionType: 'SHORT_ANSWER',
      questionText: '',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q: BankQuestion) => {
    setSelectedQuestion(q);
    setFormData({
      className: q.className,
      subject: q.subject,
      chapter: q.chapter || '',
      questionType: q.questionType,
      questionText: q.questionText,
      marks: q.marks,
      options: q.options && q.options.length > 0 ? q.options : ['', '', '', ''],
      correctAnswer: q.correctAnswer || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.className || !formData.subject || !formData.questionText) {
      toast.error('Please fill required fields (Class, Subject, Question Text)');
      return;
    }

    try {
      if (selectedQuestion) {
        await dispatch(updateBankQuestion({ id: selectedQuestion.id, data: formData })).unwrap();
        toast.success('Question updated successfully');
      } else {
        await dispatch(createBankQuestion(formData)).unwrap();
        toast.success('Question added successfully');
      }
      setIsModalOpen(false);
      dispatch(fetchBankQuestions());
    } catch (err: any) {
      toast.error(err || 'Failed to save question');
    }
  };

  const handleDelete = async () => {
    if (selectedQuestion) {
      try {
        await dispatch(deleteBankQuestion(selectedQuestion.id)).unwrap();
        toast.success('Question deleted');
        dispatch(fetchBankQuestions());
      } catch (err) {
        toast.error('Failed to delete question');
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage a central repository of reusable questions.</p>
        </div>
        <Button onClick={openAddModal} className="shadow-md">
          <Plus size={18} className="mr-2" />
          Add Question
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Repository
            </CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text"
                placeholder="Search question text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-standard focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            <Select 
              options={[{ value: '', label: 'All Classes' }, ...CLASSES]}
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-card h-9"
            />
            <Select 
              options={[{ value: '', label: 'All Subjects' }, ...SUBJECTS]}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-card h-9"
            />
            <Input 
              placeholder="Filter by Chapter" 
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="bg-card h-9"
            />
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Question</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Details</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Type</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Marks</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading questions...</td>
                </tr>
              ) : filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <tr key={q.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-foreground whitespace-normal min-w-[300px]">
                      {q.questionText}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{q.className} • {q.subject}</span>
                        {q.chapter && <span className="text-xs">Chapter: {q.chapter}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{QUESTION_TYPES.find(t => t.value === q.questionType)?.label || q.questionType}</td>
                    <td className="px-6 py-4 text-muted-foreground font-bold">{q.marks}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(q)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedQuestion(q);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No questions found in the bank.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedQuestion ? 'Edit Question' : 'Add to Question Bank'}
        size="lg"
      >
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Class" 
              options={CLASSES} 
              value={formData.className} 
              onChange={e => setFormData({ ...formData, className: e.target.value })} 
            />
            <Select 
              label="Subject" 
              options={SUBJECTS} 
              value={formData.subject} 
              onChange={e => setFormData({ ...formData, subject: e.target.value })} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Chapter (Optional)" 
              value={formData.chapter} 
              onChange={e => setFormData({ ...formData, chapter: e.target.value })} 
            />
            <Input 
              label="Marks" 
              type="number" 
              value={formData.marks} 
              onChange={e => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })} 
            />
          </div>
          <Select 
            label="Question Type" 
            options={QUESTION_TYPES} 
            value={formData.questionType} 
            onChange={e => setFormData({ ...formData, questionType: e.target.value })} 
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Question Text</label>
            <textarea 
              rows={3} 
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" 
              value={formData.questionText} 
              onChange={e => setFormData({ ...formData, questionText: e.target.value })} 
            />
          </div>

          {formData.questionType === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="text-sm font-medium text-slate-700 block">Options</label>
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map(i => (
                  <Input 
                    key={i} 
                    placeholder={`Option ${String.fromCharCode(97 + i)})`} 
                    value={formData.options?.[i] || ''} 
                    onChange={e => {
                      const newOpts = [...(formData.options || ['', '', '', ''])];
                      newOpts[i] = e.target.value;
                      setFormData({ ...formData, options: newOpts });
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{selectedQuestion ? 'Update' : 'Save Question'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </div>
  );
}
