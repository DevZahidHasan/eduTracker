import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Sparkles, Loader2, Check } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AIQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (questions: any[]) => void;
  defaultClass?: string;
  defaultSubject?: string;
}

const DIFFICULTY_LEVELS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export function AIQuestionGeneratorModal({ isOpen, onClose, onSelect, defaultClass, defaultSubject }: AIQuestionGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    if (!defaultClass || !defaultSubject || !topic) {
      toast.error('Please ensure Class, Subject, and Topic are provided.');
      return;
    }

    setIsGenerating(true);
    setGeneratedQuestions([]);
    setSelectedIndices(new Set());

    try {
      const response = await api.post('/ai-insights/generate-questions', {
        className: defaultClass,
        subject: defaultSubject,
        topic,
        difficulty,
        count
      });
      
      setGeneratedQuestions(response.data.data);
      toast.success('Questions generated successfully!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions using AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelect = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const handleImport = () => {
    const selectedQuestions = generatedQuestions.filter((_, idx) => selectedIndices.has(idx));
    onSelect(selectedQuestions);
    setTopic('');
    setGeneratedQuestions([]);
    setSelectedIndices(new Set());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Question Generator" size="xl">
      <div className="space-y-6 pt-4">
        {/* Experimental Warning */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
          <Sparkles className="shrink-0 mt-0.5" size={16} />
          <div>
            <p className="font-bold">Experimental Feature (Demo)</p>
            <p className="mt-1 text-amber-700">
              This feature currently uses a mocked response for demonstration purposes. In a production environment, this would integrate with a real AI provider like OpenAI or Google Gemini.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-600 font-medium">
            <Sparkles size={18} />
            <h3>Generate Questions with AI</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input 
                label="Topic / Keyword" 
                placeholder="e.g. Photosynthesis, Newton's Laws, World War II" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <Select 
              label="Difficulty Level" 
              options={DIFFICULTY_LEVELS}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            <Input 
              label="Number of Questions" 
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 3)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Sparkles size={16} className="mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800">Generated Suggestions</h4>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Select questions to import
              </span>
            </div>
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {generatedQuestions.map((q, idx) => {
                const isSelected = selectedIndices.has(idx);
                return (
                  <div 
                    key={idx} 
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                    onClick={() => toggleSelect(idx)}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <p className="font-medium text-slate-900 leading-relaxed text-sm">
                            {q.questionText}
                          </p>
                          <span className="shrink-0 text-xs font-bold text-slate-500 whitespace-nowrap">
                            [{q.marks} Marks]
                          </span>
                        </div>
                        
                        {q.questionType === 'MULTIPLE_CHOICE' && q.options && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt: string, optIdx: number) => (
                              <div key={optIdx} className="text-xs flex gap-2 items-center bg-white border border-slate-100 p-2 rounded">
                                <span className="font-bold text-slate-400">{String.fromCharCode(97 + optIdx)})</span>
                                <span className={opt === q.correctAnswer ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                                  {opt}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                            {q.questionType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-600 font-medium">
            {selectedIndices.size} selected
          </span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleImport} 
              disabled={selectedIndices.size === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check size={16} className="mr-2" />
              Add to Paper
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
