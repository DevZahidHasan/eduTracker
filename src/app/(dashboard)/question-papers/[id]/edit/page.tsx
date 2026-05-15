'use client';

import React, { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPaperById, 
  updateQuestionPaper, 
  selectCurrentQuestionPaper,
  selectQuestionPaperLoading
} from '@/lib/features/questionPaperSlice';
import { fetchConfig, selectClasses, selectSubjects, selectExamTypes } from '@/lib/features/configSlice';
import { fetchClassesOverview, selectClassesOverview } from '@/lib/features/classesSlice';
import { fetchSchoolProfile, selectSchoolProfile } from '@/lib/features/settingsSlice';
import toast from 'react-hot-toast';
import { Bot, Save, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionPaperSchema, QuestionPaperForm } from '@/lib/validations';
import { QuestionPaperFormData } from '@/types/question-paper';
import { QuestionBuilder } from '@/components/question-paper/QuestionBuilder';
import { QuestionPaperPreview } from '@/components/question-paper/QuestionPaperPreview';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ResizableLayout } from '@/components/ui/ResizableLayout';

export default function EditQuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);

  const paper = useAppSelector(selectCurrentQuestionPaper);
  const loading = useAppSelector(selectQuestionPaperLoading);

  // Configuration Selectors
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);
  const EXAM_TYPES = useAppSelector(selectExamTypes);
  const classesOverview = useAppSelector(selectClassesOverview);
  const schoolProfile = useAppSelector(selectSchoolProfile);

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(fetchClassesOverview());
    dispatch(fetchSchoolProfile());
    if (resolvedParams.id) {
      dispatch(fetchQuestionPaperById(resolvedParams.id));
    }
  }, [dispatch, resolvedParams.id]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<QuestionPaperForm>({
    resolver: zodResolver(questionPaperSchema) as any,
    defaultValues: {
      title: '',
      className: '',
      section: '',
      subject: '',
      examType: '',
      duration: 120,
      totalMarks: 100,
      examDate: new Date().toISOString().split('T')[0],
      instructions: '',
      questions: [],
    }
  });

  // Populate form when paper is loaded
  useEffect(() => {
    if (paper) {
      reset({
        title: paper.title,
        className: paper.className,
        section: paper.section || '',
        subject: paper.subject,
        examType: paper.examType,
        duration: paper.duration,
        totalMarks: paper.totalMarks,
        examDate: paper.examDate ? new Date(paper.examDate).toISOString().split('T')[0] : '',
        instructions: paper.instructions || '',
        questions: paper.questions.map((q, idx) => ({
          questionType: q.questionType as any,
          questionText: q.questionText,
          marks: q.marks,
          options: q.options || [],
          order: idx,
          instructions: q.instructions || '',
          correctAnswer: q.correctAnswer || ''
        })),
      });
    }
  }, [paper, reset]);

  const selectedClass = watch('className');
  const formData = watch();

  // Compute available sections based on selected class
  const availableSections = useMemo(() => {
    const defaultOption = { value: '', label: 'Select Section (Optional)' };
    if (!selectedClass) return [defaultOption];
    const classInfo = classesOverview.find(c => c.className === selectedClass);
    if (!classInfo) return [defaultOption];
    return [
      defaultOption,
      ...classInfo.sections.map(s => ({ value: s.section, label: `Section ${s.section}` }))
    ];
  }, [selectedClass, classesOverview]);

  const handleBack = () => {
    if (isDirty) {
      setUnsavedModalOpen(true);
    } else {
      router.push(`/question-papers/${resolvedParams.id}`);
    }
  };

  const onSubmit = async (data: QuestionPaperForm, shouldPublish: boolean = false) => {
    if (shouldPublish) setIsPublishing(true);
    else setIsSaving(true);
    
    try {
      const payload: Partial<QuestionPaperFormData> = {
        ...data,
        questions: (data.questions as any)?.map((q: any, index: number) => ({
          ...q,
          order: index
        })) || [],
        status: shouldPublish ? 'PUBLISHED' : undefined
      };
      
      const resultAction = await dispatch(updateQuestionPaper({ id: resolvedParams.id, data: payload }));
      if (updateQuestionPaper.fulfilled.match(resultAction)) {
        toast.success(shouldPublish ? 'Question paper published successfully' : 'Question paper updated successfully');
        router.push(`/question-papers/${resolvedParams.id}`);
      } else {
        toast.error('Failed to update paper');
      }
    } catch (err) {
      toast.error('Error updating paper');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading && !paper) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><Skeleton className="h-12 w-full" /></div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <div className="md:col-span-2"><Skeleton className="h-12 w-full" /></div>
              <div className="md:col-span-2"><Skeleton className="h-32 w-full" /></div>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const editorPanel = (
    <div className="space-y-6">
      <Card className="border-slate-200/60 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
          <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
            <Bot size={20} className="text-primary" />
            Edit Paper Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <Input 
                  label="Paper Title" 
                  placeholder="e.g. Mid Term Mathematics 2026" 
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>

              <Select 
                label="Class / Grade" 
                placeholder="Select Class"
                options={CLASSES}
                {...register('className')}
                error={errors.className?.message}
              />

              <Select 
                label="Section (Optional)" 
                placeholder="Select Section"
                options={availableSections}
                {...register('section')}
                error={errors.section?.message}
                disabled={!selectedClass}
              />

              <Select 
                label="Academic Subject" 
                placeholder="Select Subject"
                options={SUBJECTS}
                {...register('subject')}
                error={errors.subject?.message}
              />

              <Select 
                label="Exam Type" 
                placeholder="Select Assessment Type"
                options={EXAM_TYPES}
                {...register('examType')}
                error={errors.examType?.message}
              />

              <Input 
                label="Duration (minutes)" 
                type="number"
                placeholder="e.g. 120"
                {...register('duration')}
                error={errors.duration?.message}
              />

              <Input 
                label="Total Marks" 
                type="number"
                placeholder="e.g. 100"
                {...register('totalMarks')}
                error={errors.totalMarks?.message}
              />

              <div className="md:col-span-2">
                <Input 
                  label="Date of Examination" 
                  type="date"
                  {...register('examDate')}
                  error={errors.examDate?.message}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-0.5">General Instructions</label>
                <textarea 
                  rows={4}
                  {...register('instructions')}
                  className={`w-full p-3.5 rounded-lg border bg-white text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-standard shadow-sm resize-y ${
                    errors.instructions ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                  }`}
                  placeholder="Enter any specific instructions for the students..."
                />
                {errors.instructions && (
                  <p className="text-xs text-red-500 font-bold mt-1 ml-0.5">{errors.instructions.message}</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <QuestionBuilder control={control} register={register} errors={errors} />
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                loading={isSaving} 
                className="px-8 h-11 text-sm font-bold tracking-wide border-slate-200"
              >
                <Save size={18} className="mr-2" />
                Update Draft
              </Button>
              {paper?.status === 'DRAFT' && (
                <Button 
                  type="button"
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  loading={isPublishing} 
                  className="px-8 shadow-lg shadow-blue-200 h-11 text-sm font-bold tracking-wide"
                >
                  <CheckCircle2 size={18} className="mr-2" />
                  Publish Paper
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const previewPanel = (
    <div className="sticky top-24 h-[calc(100vh-140px)] animate-in slide-in-from-right duration-500 print:static print:h-auto print:block">
      <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col shadow-inner print:border-none print:rounded-none print:shadow-none print:bg-transparent print:overflow-visible print:block">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs font-bold border-slate-200 hover:bg-slate-50">
              Print / Export
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
              <EyeOff size={16} />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden print:overflow-visible print:block">
          <QuestionPaperPreview data={formData as any} schoolProfile={schoolProfile} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 pb-12 transition-all duration-500 ${showPreview ? 'max-w-[1600px] mx-auto' : 'max-w-4xl mx-auto'} print:m-0 print:p-0 print:max-w-none print:w-full print:space-y-0`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack} className="px-3 shadow-sm border-slate-200">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Paper</h1>
            <p className="text-muted-foreground font-medium mt-1">Modifying: {paper?.title || 'Loading...'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={showPreview ? "primary" : "outline"}
            onClick={() => setShowPreview(!showPreview)}
            className={`gap-2 ${showPreview ? 'bg-primary text-white shadow-primary/20' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? "Hide Preview" : "Live Preview"}
          </Button>
        </div>
      </div>

      <ResizableLayout
        leftPanel={editorPanel}
        rightPanel={previewPanel}
        showRightPanel={showPreview}
      />

      <ConfirmationModal
        isOpen={unsavedModalOpen}
        onClose={() => setUnsavedModalOpen(false)}
        onConfirm={() => router.push(`/question-papers/${resolvedParams.id}`)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave? Your progress will be lost."
        confirmText="Leave Page"
        cancelText="Stay Here"
        destructive={true}
      />
    </div>
  );
}
