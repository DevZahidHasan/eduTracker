'use client';

import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPaperById, 
  selectCurrentQuestionPaper, 
  selectQuestionPaperLoading 
} from '@/lib/features/questionPaperSlice';
import { fetchSchoolProfile, selectSchoolProfile } from '@/lib/features/settingsSlice';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Printer, FileDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { QuestionPaperPreview } from '@/components/question-paper/QuestionPaperPreview';

export default function ViewQuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const paper = useAppSelector(selectCurrentQuestionPaper);
  const loading = useAppSelector(selectQuestionPaperLoading);
  const schoolProfile = useAppSelector(selectSchoolProfile);

  useEffect(() => {
    if (resolvedParams.id) {
      dispatch(fetchQuestionPaperById(resolvedParams.id));
      dispatch(fetchSchoolProfile());
    }
  }, [dispatch, resolvedParams.id]);

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading paper details...</div>;
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => window.print()} className="flex-1 sm:flex-none border-slate-200 shadow-sm">
            <Printer size={18} className="mr-2" />
            Print
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 shadow-sm">
            <FileDown size={18} className="mr-2" />
            PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none shadow-lg shadow-primary/20">
            <CheckCircle2 size={18} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <QuestionPaperPreview data={paperData} schoolProfile={schoolProfile} />
      </div>
    </div>
  );
}
