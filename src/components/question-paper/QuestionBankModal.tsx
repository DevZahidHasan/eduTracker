import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchBankQuestions, selectAllBankQuestions, selectQuestionBankLoading } from '@/lib/features/questionBankSlice';
import { BankQuestion } from '@/types/question-bank';
import { Search, Plus, Check } from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (questions: BankQuestion[]) => void;
  subject?: string;
  className?: string;
}

export function QuestionBankModal({ isOpen, onClose, onSelect, subject, className }: QuestionBankModalProps) {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectAllBankQuestions);
  const loading = useAppSelector(selectQuestionBankLoading);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    if (isOpen) {
      setSelectedIds(new Set());
    }
    setPrevIsOpen(isOpen);
  }

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBankQuestions({ subject, className }));
    }
  }, [isOpen, dispatch, subject, className]);

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleImport = () => {
    const selectedQuestions = questions.filter(q => selectedIds.has(q.id));
    onSelect(selectedQuestions);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from Question Bank" size="xl">
      <div className="space-y-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading questions...</div>
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map(q => {
              const isSelected = selectedIds.has(q.id);
              return (
                <div 
                  key={q.id} 
                  className={`p-4 flex gap-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                  onClick={() => toggleSelect(q.id)}
                >
                  <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                    {isSelected && <Check size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{q.questionText}</p>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded">{q.questionType}</span>
                      <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded">{q.marks} Marks</span>
                      {q.chapter && <span>Chapter: {q.chapter}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500">No questions found for this subject/class.</div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-600 font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleImport} disabled={selectedIds.size === 0}>
              <Plus size={16} className="mr-2" />
              Import {selectedIds.size} Questions
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
