'use client';

import React, { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPaperById, 
  selectCurrentQuestionPaper, 
  selectQuestionPaperLoading,
  duplicateQuestionPaper,
  updateQuestionPaper
} from '@/lib/features/questionPaperSlice';
import { fetchSchoolProfile, selectSchoolProfile } from '@/lib/features/settingsSlice';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Printer, FileDown, CheckCircle2, Loader2, Edit, FileText, Copy } from 'lucide-react';
import Link from 'next/link';
import { QuestionPaperPreview } from '@/components/question-paper/QuestionPaperPreview';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ViewQuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const paper = useAppSelector(selectCurrentQuestionPaper);
  const loading = useAppSelector(selectQuestionPaperLoading);
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const [isExporting, setIsExporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!paper) return;
    setIsExporting(true);
    
    try {
      const response = await api.get(`/question-papers/${paper.id}/export/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${paper.id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDuplicateClick = () => {
    setDuplicateModalOpen(true);
  };

  const handleDuplicateConfirm = async () => {
    if (!paper) return;
    const resultAction = await dispatch(duplicateQuestionPaper({ 
      id: paper.id, 
      options: { title: `Copy of ${paper.title}`, isTemplate: paper.isTemplate } 
    }));
    
    if (duplicateQuestionPaper.fulfilled.match(resultAction)) {
      toast.success('Duplicated successfully');
      router.push(`/question-papers/${(resultAction.payload as any).id}`);
    } else {
      toast.error('Failed to duplicate');
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!paper) return;
    const resultAction = await dispatch(duplicateQuestionPaper({ 
      id: paper.id, 
      options: { title: `${paper.title} (Template)`, isTemplate: true } 
    }));
    
    if (duplicateQuestionPaper.fulfilled.match(resultAction)) {
      toast.success('Saved as template successfully');
    } else {
      toast.error('Failed to save as template');
    }
  };

  const handlePublish = async () => {
    if (!paper) return;
    setIsPublishing(true);
    try {
      const resultAction = await dispatch(updateQuestionPaper({ 
        id: paper.id, 
        data: { status: 'PUBLISHED' } 
      }));
      
      if (updateQuestionPaper.fulfilled.match(resultAction)) {
        toast.success('Question paper published successfully');
        dispatch(fetchQuestionPaperById(resolvedParams.id));
      } else {
        toast.error('Failed to publish');
      }
    } catch (err) {
      toast.error('Error publishing paper');
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    if (resolvedParams.id) {
      dispatch(fetchQuestionPaperById(resolvedParams.id));
      dispatch(fetchSchoolProfile());
    }
  }, [dispatch, resolvedParams.id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
        <Card className="min-h-[800px] border-slate-200">
          <CardContent className="p-12 space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-8 pt-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paper) {
    return <div className="p-12 text-center text-muted-foreground">Paper not found.</div>;
  }

  // Map paper to QuestionPaperForm type for preview component
  const paperData = {
    ...paper,
    examDate: paper.examDate ? new Date(paper.examDate).toISOString().split('T')[0] : '',
    questions: paper.questions.map(q => ({
      ...q,
      options: q.options || ['', '', '', ''],
    }))
  } as any;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto print:space-y-0 print:p-0 print:m-0 print:max-w-none print:w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/question-papers">
            <Button variant="outline" className="px-3 shadow-sm border-slate-200">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{paper.title}</h1>
            <p className="text-muted-foreground font-medium mt-1">Class {paper.className} • {paper.subject}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-end">
          <Button variant="outline" onClick={() => handlePrint()} className="flex-1 sm:flex-none border-slate-200 shadow-sm">
            <Printer size={18} className="mr-2" />
            Print
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPdf}
            loading={isExporting}
            className="flex-1 sm:flex-none border-slate-200 shadow-sm w-24"
          >
            PDF
          </Button>
          <Button variant="outline" onClick={handleDuplicateClick} className="flex-1 sm:flex-none border-slate-200 shadow-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50">
            <Copy size={18} className="mr-2" />
            Duplicate
          </Button>
          {!paper.isTemplate && (
            <Button variant="outline" onClick={handleSaveAsTemplate} className="flex-1 sm:flex-none border-slate-200 shadow-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              <FileText size={18} className="mr-2" />
              Save as Template
            </Button>
          )}
          <Link href={`/question-papers/${paper.id}/edit`} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full border-slate-200 shadow-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              <Edit size={18} className="mr-2" />
              Edit
            </Button>
          </Link>
          {paper.status === 'DRAFT' && (
            <Button 
              onClick={handlePublish}
              loading={isPublishing}
              className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none shadow-lg shadow-primary/20"
            >
              <CheckCircle2 size={18} className="mr-2" />
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 print:bg-transparent print:rounded-none print:shadow-none print:border-none print:overflow-visible print:w-full print:m-0 print:p-0">
        <QuestionPaperPreview data={paperData} schoolProfile={schoolProfile} />
      </div>

      <ConfirmationModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onConfirm={handleDuplicateConfirm}
        title="Duplicate Question Paper"
        message="Are you sure you want to duplicate this question paper? This will create a fresh draft copy."
        confirmText="Duplicate"
        cancelText="Cancel"
        destructive={false}
      />
    </div>
  );
}
