'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Search, FileText, Check, Clock } from 'lucide-react';
import { questionPaperService } from '@/services/question-paper.service';
import { QuestionPaper } from '@/types/question-paper';
import { Skeleton } from '@/components/ui/Skeleton';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: QuestionPaper) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [templates, setTemplates] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      try {
        const data = await questionPaperService.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.className.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select a Template" size="2xl">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search templates by title, class or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border border-border rounded-lg space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group relative"
                onClick={() => onSelect(template)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      <FileText size={16} />
                      {template.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded">{template.className}</span>
                      <span className="bg-muted px-2 py-0.5 rounded">{template.subject}</span>
                      <span className="bg-muted px-2 py-0.5 rounded">{template.examType}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {template.duration} mins
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check size={16} />
                  </div>
                </div>
                {template.instructions && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-1 italic">
                    {template.instructions}
                  </p>
                )}
                <div className="mt-2 text-[10px] font-bold text-primary/70">
                  {template.questions.length} Questions • {template.totalMarks} Marks
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <FileText size={40} className="mx-auto mb-3 opacity-20" />
              <p>No templates found.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
