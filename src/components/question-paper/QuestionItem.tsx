import React from 'react';
import { UseFormRegister, FieldErrors, Control, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Trash2, GripVertical } from 'lucide-react';
import { QuestionPaperForm } from '@/lib/validations';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface QuestionItemProps {
  id: string;
  index: number;
  register: UseFormRegister<QuestionPaperForm>;
  control: Control<QuestionPaperForm>;
  errors: FieldErrors<QuestionPaperForm>;
  onRemove: () => void;
}

export function QuestionItem({ id, index, register, control, errors, onRemove }: QuestionItemProps) {
  const qErrors = errors.questions?.[index];
  const type = useWatch({
    control,
    name: `questions.${index}.type`,
    defaultValue: 'SHORT_ANSWER'
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative p-5 bg-white border border-slate-200 rounded-xl group transition-all hover:shadow-md hover:border-slate-300"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-r border-slate-200 bg-slate-50 rounded-l-xl cursor-move touch-none"
      >
        <GripVertical size={16} className="text-slate-400" />
      </div>
      
      <div className="pl-6 space-y-4">
        {/* Header Row: Text, Type, Marks, Remove */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7">
              <Input
                label={`Question ${index + 1}`}
                placeholder="Enter question text..."
                {...register(`questions.${index}.text` as const)}
                error={qErrors?.text?.message}
              />
            </div>
            
            <div className="md:col-span-3">
              <Select
                label="Type"
                options={[
                  { value: 'SHORT_ANSWER', label: 'Short Q.' },
                  { value: 'LONG_ANSWER', label: 'Creative Q.' },
                  { value: 'MULTIPLE_CHOICE', label: 'MCQ' },
                  { value: 'TRUE_FALSE', label: 'True/False' },
                ]}
                {...register(`questions.${index}.type` as const)}
                error={qErrors?.type?.message}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Marks"
                type="number"
                placeholder="0"
                {...register(`questions.${index}.marks` as const)}
                error={qErrors?.marks?.message}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            className="mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 shrink-0"
            title="Remove Question"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Optional Instructions */}
        <div>
          <Input
            label="Specific Instructions (Optional)"
            placeholder="e.g., Answer in 50 words"
            {...register(`questions.${index}.instructions` as const)}
            error={qErrors?.instructions?.message}
          />
        </div>

        {/* Dynamic Fields Based on Question Type */}
        <div className="pt-2">
          {type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <label className="text-sm font-bold text-slate-700">MCQ Options</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((optIndex) => (
                  <Input
                    key={optIndex}
                    placeholder={`Option ${optIndex + 1}`}
                    {...register(`questions.${index}.options.${optIndex}` as const)}
                  />
                ))}
              </div>
              <div className="w-1/2 pt-2">
                <Select
                  label="Correct Answer"
                  options={[
                    { value: '0', label: 'Option 1' },
                    { value: '1', label: 'Option 2' },
                    { value: '2', label: 'Option 3' },
                    { value: '3', label: 'Option 4' },
                  ]}
                  {...register(`questions.${index}.correctAnswer` as const)}
                />
              </div>
            </div>
          )}

          {type === 'TRUE_FALSE' && (
            <div className="w-1/3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <Select
                label="Correct Answer"
                options={[
                  { value: 'True', label: 'True' },
                  { value: 'False', label: 'False' },
                ]}
                {...register(`questions.${index}.correctAnswer` as const)}
              />
            </div>
          )}

          {type === 'LONG_ANSWER' && (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-700">
              <p><strong>Creative Question format:</strong> Ensure sufficient blank space will be generated on the paper. You can specify constraints in the instructions field above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
