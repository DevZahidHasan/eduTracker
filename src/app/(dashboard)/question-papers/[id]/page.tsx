'use client';

import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPaperById, 
  selectCurrentQuestionPaper, 
  selectQuestionPaperLoading 
} from '@/lib/features/questionPaperSlice';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Printer, FileDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ViewQuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const paper = useAppSelector(selectCurrentQuestionPaper);
  const loading = useAppSelector(selectQuestionPaperLoading);

  useEffect(() => {
    if (resolvedParams.id) {
      dispatch(fetchQuestionPaperById(resolvedParams.id));
    }
  }, [dispatch, resolvedParams.id]);

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading paper details...</div>;
  }

  if (!paper) {
    return <div className="p-12 text-center text-muted-foreground">Paper not found.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/question-papers">
            <Button variant="outline" className="px-3">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{paper.title}</h1>
            <p className="text-muted-foreground font-medium mt-1">Class {paper.className} • {paper.subject}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Printer size={18} className="mr-2" />
            Print
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none">
            <FileDown size={18} className="mr-2" />
            PDF
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none">
            <CheckCircle2 size={18} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm print:shadow-none print:border-none bg-white">
        <CardHeader className="border-b border-border bg-white p-8 print:p-0 print:border-b-2 print:border-black rounded-t-xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{paper.examType.replace('_', ' ')} EXAMINATION</h2>
            <h3 className="text-xl font-semibold text-slate-800">{paper.subject} - Class {paper.className}</h3>
            <div className="flex justify-between items-center pt-6 font-bold text-sm text-slate-700 border-t border-slate-100 mt-4">
              <span>Time: {paper.duration} Minutes</span>
              <span>Max Marks: {paper.totalMarks}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8 bg-white print:p-0 print:pt-4">
          <div className="space-y-2 pb-6 border-b border-border text-slate-800">
            <h4 className="font-bold underline">General Instructions:</h4>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{paper.instructions}</p>
          </div>

          <div className="space-y-8 text-slate-900">
            {paper.questions && paper.questions.length > 0 ? (
              paper.questions.map((q, index) => (
                <div key={q.id} className="flex gap-4">
                  <span className="font-bold">{index + 1}.</span>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between gap-4">
                      <p className="font-medium">{q.questionText}</p>
                      <span className="font-bold whitespace-nowrap">[{q.marks}]</span>
                    </div>
                    {q.questionType === 'MULTIPLE_CHOICE' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex gap-3 items-center">
                            <span className="font-medium text-slate-500">({String.fromCharCode(97 + i)})</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {(q.questionType === 'LONG_ANSWER' || q.questionType === 'SHORT_ANSWER') && (
                      <div className="h-24 border-b border-dashed border-slate-300 mt-6"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="font-medium">No questions generated yet.</p>
                <p className="text-xs mt-2 text-slate-400">Click the button below to automatically generate AI questions based on your parameters.</p>
                <Button variant="outline" className="mt-6 border-primary/20 text-primary hover:bg-primary/5">
                  Generate Questions with AI
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
