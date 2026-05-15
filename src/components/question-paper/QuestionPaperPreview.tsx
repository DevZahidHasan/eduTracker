'use client';

import React from 'react';
import { QuestionPaperForm } from '@/lib/validations';
import { SchoolProfile } from '@/types/models';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';

interface QuestionPaperPreviewProps {
  data: QuestionPaperForm;
  schoolProfile: SchoolProfile | null;
  loading?: boolean;
}

export function QuestionPaperPreview({ data, schoolProfile, loading = false }: QuestionPaperPreviewProps) {
  if (loading) {
    return (
      <div className="w-full h-full overflow-y-auto bg-slate-100 p-4 lg:p-8 flex justify-center animate-pulse">
        <Card className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl mx-auto p-12 space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3 pt-4" />
          </div>
          <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-8 pt-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const {
    title,
    className,
    section,
    subject,
    examType,
    duration,
    totalMarks,
    examDate,
    instructions,
    questions,
  } = data;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-100 p-4 lg:p-8 flex justify-center print:block print:overflow-visible print:h-auto print:bg-white print:p-0">
      <Card className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl mx-auto print:shadow-none print:max-w-none print:w-[210mm] print:border-none print:rounded-none">
        <CardContent className="p-8 lg:p-12 space-y-8 print:p-10 print:text-black">
          {/* Header */}
          <div className="text-center space-y-4 border-b-2 border-slate-900 pb-6 relative">
            {schoolProfile?.logo && (
              <div className="absolute left-0 top-0 w-20 h-20">
                <Image 
                  src={schoolProfile.logo} 
                  alt="School Logo" 
                  width={80} 
                  height={80}
                  className="object-contain"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
                {schoolProfile?.name || 'Your School Name'}
              </h1>
              {schoolProfile?.address && (
                <p className="text-sm text-slate-600 italic">{schoolProfile.address}</p>
              )}
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-bold text-slate-900 underline decoration-2 underline-offset-4">
                {examType ? `${examType} EXAMINATION` : 'ANNUAL EXAMINATION'} - {examDate && !isNaN(new Date(examDate).getTime()) ? new Date(examDate).getFullYear() : new Date().getFullYear()}
              </h2>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-3 text-sm font-semibold border-b border-slate-200 pb-4">
            <div className="flex gap-2">
              <span className="text-slate-500 uppercase">Subject:</span>
              <span className="text-slate-900">{title || '________________'}</span>
            </div>
            <div className="flex gap-2 justify-end">
              <span className="text-slate-500 uppercase">Class:</span>
              <span className="text-slate-900">{className || '____'} {section ? `(${section})` : ''}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500 uppercase">Time:</span>
              <span className="text-slate-900">{duration || '___'} Minutes</span>
            </div>
            <div className="flex gap-2 justify-end">
              <span className="text-slate-500 uppercase">Max Marks:</span>
              <span className="text-slate-900">{totalMarks || '___'}</span>
            </div>
            <div className="flex gap-2 col-span-2">
              <span className="text-slate-500 uppercase">Date:</span>
              <span className="text-slate-900">{examDate ? new Date(examDate).toLocaleDateString() : '________________'}</span>
            </div>
          </div>

          {/* Instructions */}
          {instructions && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase underline">General Instructions:</h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pl-4">
                {instructions}
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6 pt-4 print:space-y-5">
            {questions && questions.length > 0 ? (
              questions.map((q, index) => (
                <div key={index} className="space-y-3 relative group break-inside-avoid">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 flex-1">
                      <span className="font-bold text-slate-900 min-w-[24px]">Q{index + 1}.</span>
                      <div className="flex-1 space-y-3">
                        <p className="text-[15px] text-slate-900 font-medium leading-relaxed">
                          {q.questionText || 'Question text goes here...'}
                        </p>
                        
                        {/* Options for MCQs */}
                        {q.questionType === 'MULTIPLE_CHOICE' && q.options && (
                          <div className="grid grid-cols-2 gap-4 pl-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex gap-2 text-sm text-slate-700">
                                <span className="font-semibold">{String.fromCharCode(97 + optIdx)})</span>
                                <span>{opt || `Option ${optIdx + 1}`}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Space for True/False */}
                        {q.questionType === 'TRUE_FALSE' && (
                          <div className="flex gap-8 pl-2">
                            <div className="flex gap-2 text-sm text-slate-700">
                              <span className="w-4 h-4 rounded-full border border-slate-400 mt-0.5" />
                              <span>True</span>
                            </div>
                            <div className="flex gap-2 text-sm text-slate-700">
                              <span className="w-4 h-4 rounded-full border border-slate-400 mt-0.5" />
                              <span>False</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 shrink-0 border-b border-slate-400 pb-0.5 px-2">
                      [{q.marks || 0}]
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-slate-400 italic">No questions added yet. They will appear here in real-time.</p>
              </div>
            )}
          </div>

          {/* Footer for the paper */}
          <div className="pt-12 border-t border-slate-200 mt-auto">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>*** END OF QUESTION PAPER ***</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
