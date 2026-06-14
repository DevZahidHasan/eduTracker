import React, { useState } from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { QuestionPaperForm } from '@/lib/validations';
import { QuestionItem } from './QuestionItem';
import { QuestionBankModal } from './QuestionBankModal';
import { AIQuestionGeneratorModal } from './AIQuestionGeneratorModal';
import { BankQuestion } from '@/types/question-bank';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface QuestionBuilderProps {
  control: Control<QuestionPaperForm>;
  register: UseFormRegister<QuestionPaperForm>;
  errors: FieldErrors<QuestionPaperForm>;
}

export function QuestionBuilder({ control, register, errors }: QuestionBuilderProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const currentSubject = useWatch({ control, name: 'subject' });
  const currentClass = useWatch({ control, name: 'className' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddQuestion = () => {
    append({
      questionText: '',
      questionType: 'SHORT_ANSWER',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      instructions: '',
    });
  };

  const handleImportQuestions = (bankQuestions: any[]) => {
    const formattedQuestions = bankQuestions.map(bq => ({
      questionText: bq.questionText,
      questionType: bq.questionType as any,
      marks: bq.marks,
      options: bq.options && bq.options.length > 0 ? bq.options : ['', '', '', ''],
      correctAnswer: bq.correctAnswer || '',
      instructions: '',
    }));
    
    append(formattedQuestions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <h3 className="text-lg font-bold text-slate-900">Questions</h3>
        <div className="flex gap-2 flex-wrap">
          <Button 
            type="button" 
            onClick={() => setIsAIModalOpen(true)}
            variant="outline" 
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Sparkles size={16} className="mr-2" />
            AI Suggest (Beta)
          </Button>
          <Button 
            type="button" 
            onClick={() => setIsBankModalOpen(true)}
            variant="outline" 
            size="sm"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <BookOpen size={16} className="mr-2" />
            Import from Bank
          </Button>
          <Button 
            type="button" 
            onClick={handleAddQuestion}
            variant="outline" 
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <Plus size={16} className="mr-2" />
            Add Blank
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <QuestionItem
                key={field.id}
                id={field.id}
                index={index}
                register={register}
                control={control}
                errors={errors}
                onRemove={() => remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {fields.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Plus size={24} />
            </div>
            <h4 className="text-slate-900 font-bold mb-1">No Questions Added</h4>
            <p className="text-slate-500 text-sm mb-4">Start building your question paper by adding the first question.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button 
                type="button" 
                onClick={() => setIsAIModalOpen(true)}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Sparkles size={16} className="mr-2" />
                AI Suggest (Beta)
              </Button>
              <Button 
                type="button" 
                onClick={() => setIsBankModalOpen(true)}
                variant="outline"
              >
                <BookOpen size={16} className="mr-2" />
                Import from Bank
              </Button>
              <Button 
                type="button" 
                onClick={handleAddQuestion}
                className="shadow-sm"
              >
                Add Blank Question
              </Button>
            </div>
          </div>
        )}
      </div>

      <QuestionBankModal 
        isOpen={isBankModalOpen} 
        onClose={() => setIsBankModalOpen(false)} 
        onSelect={handleImportQuestions}
        subject={currentSubject}
        className={currentClass}
      />
      <AIQuestionGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSelect={handleImportQuestions}
        defaultClass={currentClass}
        defaultSubject={currentSubject}
      />
    </div>
  );
}
