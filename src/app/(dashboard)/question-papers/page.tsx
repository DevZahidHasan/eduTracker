'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, Search, Eye 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchQuestionPapers, 
  selectAllQuestionPapers, 
  selectQuestionPaperLoading 
} from '@/lib/features/questionPaperSlice';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function QuestionPapersPage() {
  const dispatch = useAppDispatch();
  const papers = useAppSelector(selectAllQuestionPapers);
  const loading = useAppSelector(selectQuestionPaperLoading);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchQuestionPapers());
  }, [dispatch]);

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Question Papers</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and generate examination question papers.</p>
        </div>
        <Link href="/question-papers/create">
          <Button className="shadow-md">
            <Plus size={18} className="mr-2" />
            Create Paper
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Generated Papers
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-standard focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-sm"
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Title</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Class</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Subject</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading papers...</td>
                </tr>
              ) : filteredPapers.length > 0 ? (
                filteredPapers.map(paper => (
                  <tr key={paper.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground">{paper.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{paper.className}</td>
                    <td className="px-6 py-4 text-muted-foreground">{paper.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest ${
                        paper.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(paper.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                        <Link href={`/question-papers/${paper.id}`}>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View">
                            <Eye size={16} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No papers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
