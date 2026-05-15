'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Search, Eye, Edit2, Trash2, Copy, Printer, FileDown 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPapers, 
  selectAllQuestionPapers, 
  selectQuestionPaperLoading,
  deleteQuestionPaper,
  createQuestionPaper,
  duplicateQuestionPaper
} from '@/lib/features/questionPaperSlice';
import { 
  fetchConfig, selectClasses, selectSubjects, selectExamTypes 
} from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { QuestionPaper, QuestionPaperFormData } from '@/types/question-paper';

export default function QuestionPapersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const papers = useAppSelector(selectAllQuestionPapers);
  const loading = useAppSelector(selectQuestionPaperLoading);
  
  const CLASSES = useAppSelector(selectClasses);
  const SUBJECTS = useAppSelector(selectSubjects);
  const EXAM_TYPES = useAppSelector(selectExamTypes);

  // Tabs
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'TEMPLATES'>('PAPERS');

  // Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');

  // Modals and Actions
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [paperToDuplicate, setPaperToDuplicate] = useState<QuestionPaper | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchQuestionPapers({ isTemplate: activeTab === 'TEMPLATES' }));
    dispatch(fetchConfig());
  }, [dispatch, activeTab]);

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.subject.toLowerCase().includes(search.toLowerCase());
      const matchesClass = classFilter ? p.className === classFilter : true;
      const matchesSubject = subjectFilter ? p.subject === subjectFilter : true;
      const matchesExamType = examTypeFilter ? p.examType === examTypeFilter : true;
      
      return matchesSearch && matchesClass && matchesSubject && matchesExamType;
    });
  }, [papers, search, classFilter, subjectFilter, examTypeFilter]);

  const handleDeleteConfirm = async () => {
    if (paperToDelete) {
      const resultAction = await dispatch(deleteQuestionPaper(paperToDelete));
      if (deleteQuestionPaper.fulfilled.match(resultAction)) {
        toast.success(`${activeTab === 'TEMPLATES' ? 'Template' : 'Paper'} deleted successfully`);
        dispatch(fetchQuestionPapers({ isTemplate: activeTab === 'TEMPLATES' }));
      } else {
        toast.error('Failed to delete');
      }
    }
    setDeleteModalOpen(false);
    setPaperToDelete(null);
  };

  const handleDuplicateClick = (paper: QuestionPaper) => {
    setPaperToDuplicate(paper);
    setDuplicateModalOpen(true);
  };

  const handleDuplicateConfirm = async () => {
    if (!paperToDuplicate) return;
    
    const resultAction = await dispatch(duplicateQuestionPaper({ 
      id: paperToDuplicate.id, 
      options: { title: `Copy of ${paperToDuplicate.title}`, isTemplate: paperToDuplicate.isTemplate } 
    }));
    
    if (duplicateQuestionPaper.fulfilled.match(resultAction)) {
      toast.success('Duplicated successfully');
      dispatch(fetchQuestionPapers({ isTemplate: activeTab === 'TEMPLATES' }));
    } else {
      toast.error('Failed to duplicate');
    }
    
    setDuplicateModalOpen(false);
    setPaperToDuplicate(null);
  };

  const handleCreateFromTemplate = async (template: QuestionPaper) => {
    const resultAction = await dispatch(duplicateQuestionPaper({ 
      id: template.id, 
      options: { title: `${template.title} - ${new Date().getFullYear()}`, isTemplate: false } 
    }));
    
    if (duplicateQuestionPaper.fulfilled.match(resultAction)) {
      toast.success('Paper created from template');
      router.push(`/question-papers/${(resultAction.payload as any).id}/edit`);
    } else {
      toast.error('Failed to create paper from template');
    }
  };

  const handleSaveAsTemplate = async (paper: QuestionPaper) => {
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

  const handleExportPdf = async (paperId: string, title: string) => {
    setExportingId(paperId);
    try {
      const response = await api.get(`/question-papers/${paperId}/export/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${paperId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF.');
    } finally {
      setExportingId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setClassFilter('');
    setSubjectFilter('');
    setExamTypeFilter('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Question Papers</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and generate examination question papers.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted p-1 rounded-lg flex mr-4">
            <button 
              onClick={() => setActiveTab('PAPERS')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'PAPERS' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Papers
            </button>
            <button 
              onClick={() => setActiveTab('TEMPLATES')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'TEMPLATES' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Templates
            </button>
          </div>
          <Link href="/question-papers/create">
            <Button className="shadow-md">
              <Plus size={18} className="mr-2" />
              Create Paper
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Paper Directory
            </CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text"
                placeholder="Search by title or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-standard focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            <Select 
              options={[{ value: '', label: 'All Classes' }, ...CLASSES]}
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-card h-9"
            />
            <Select 
              options={[{ value: '', label: 'All Subjects' }, ...SUBJECTS]}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-card h-9"
            />
            <Select 
              options={[{ value: '', label: 'All Exam Types' }, ...EXAM_TYPES]}
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              className="bg-card h-9"
            />
            {(search || classFilter || subjectFilter || examTypeFilter) && (
              <Button variant="ghost" onClick={clearFilters} className="h-9 text-muted-foreground hover:text-foreground">
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Title</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Class</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Subject</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Exam Type</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))
              ) : filteredPapers.length > 0 ? (
                filteredPapers.map(paper => (
                  <tr key={paper.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="truncate max-w-[200px] block" title={paper.title}>{paper.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{paper.className}</td>
                    <td className="px-6 py-4 text-muted-foreground">{paper.subject}</td>
                    <td className="px-6 py-4 text-muted-foreground">{paper.examType || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest ${
                        paper.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {paper.examDate ? new Date(paper.examDate).toLocaleDateString() : new Date(paper.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/question-papers/${paper.id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" 
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => router.push(`/question-papers/${paper.id}/edit`)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDuplicateClick(paper)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition-colors" 
                          title="Duplicate"
                        >
                          <Copy size={16} />
                        </button>
                        {activeTab === 'PAPERS' ? (
                          <button 
                            onClick={() => handleSaveAsTemplate(paper)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors" 
                            title="Save as Template"
                          >
                            <FileText size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleCreateFromTemplate(paper)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors" 
                            title="Create Paper from Template"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => router.push(`/question-papers/${paper.id}`)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" 
                          title="Print"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => handleExportPdf(paper.id, paper.title)}
                          disabled={exportingId === paper.id}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors disabled:opacity-50 flex items-center justify-center min-w-[28px]" 
                          title="Export PDF"
                        >
                          {exportingId === paper.id ? <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> : <FileDown size={16} />}
                        </button>
                        <button 
                          onClick={() => {
                            setPaperToDelete(paper.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText size={32} className="mb-2 opacity-50" />
                      <p>No question papers found matching your criteria.</p>
                      <Button variant="ghost" onClick={clearFilters} className="mt-4">
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPaperToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Question Paper"
        message="Are you sure you want to delete this question paper? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />

      <ConfirmationModal
        isOpen={duplicateModalOpen}
        onClose={() => {
          setDuplicateModalOpen(false);
          setPaperToDuplicate(null);
        }}
        onConfirm={handleDuplicateConfirm}
        title="Duplicate Question Paper"
        message={`Are you sure you want to duplicate "${paperToDuplicate?.title}"? This will create a fresh draft copy.`}
        confirmText="Duplicate"
        cancelText="Cancel"
        destructive={false}
      />
    </div>
  );
}
