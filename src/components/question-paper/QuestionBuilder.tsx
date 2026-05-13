import React from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { QuestionPaperForm } from '@/lib/validations';
import { QuestionItem } from './QuestionItem';
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
      text: '',
      type: 'SHORT_ANSWER',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      instructions: '',
    });
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
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Questions</h3>
        <Button 
          type="button" 
          onClick={handleAddQuestion}
          variant="outline" 
          size="sm"
          className="border-primary/20 text-primary hover:bg-primary/5"
        >
          <Plus size={16} className="mr-2" />
          Add Question
        </Button>
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
            <Button 
              type="button" 
              onClick={handleAddQuestion}
              className="shadow-sm"
            >
              Add First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
