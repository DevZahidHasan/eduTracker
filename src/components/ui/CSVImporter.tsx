'use client';

import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface CSVImporterProps {
  type: 'students' | 'staff' | 'books';
  onSuccess?: () => void;
  onClose?: () => void;
}

export function CSVImporter({ type, onSuccess, onClose }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: { row: number; errors: string[] }[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error('Please select a valid CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post(`/import/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setResult(res.data.data);
        toast.success(`Import completed: ${res.data.data.success} successful`);
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/import/template/${type}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Upload size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground capitalize">Import {type}</h3>
            <p className="text-xs text-muted-foreground">Bulk upload data using a CSV file</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {!result ? (
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
              ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".csv"
            />
            {file ? (
              <>
                <FileText size={40} className="text-primary" />
                <span className="text-sm font-bold text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-muted">
                   <Upload size={24} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Click to browse or drag and drop</span>
                <span className="text-xs text-muted-foreground">Only .csv files are supported</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="flex-1"
            >
              <Download size={16} className="mr-2" /> Download Template
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="mr-2" /> Start Import
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-3 gap-4">
             <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-center">
                <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Total</span>
                <span className="text-2xl font-black text-foreground">{result.total}</span>
             </div>
             <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-center">
                <span className="block text-[10px] uppercase font-bold text-green-600 mb-1">Success</span>
                <span className="text-2xl font-black text-green-600">{result.success}</span>
             </div>
             <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center">
                <span className="block text-[10px] uppercase font-bold text-red-600 mb-1">Failed</span>
                <span className="text-2xl font-black text-red-600">{result.failed}</span>
             </div>
          </div>

          {result.errors.length > 0 && (
            <div className="max-h-64 overflow-y-auto border border-border rounded-xl divide-y divide-border">
              {result.errors.map((err, i) => (
                <div key={i} className="p-3 flex items-start gap-3 bg-red-50/30 dark:bg-red-900/10">
                   <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                   <div>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">Row {err.row}</span>
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        {err.errors.map((msg, j) => (
                          <li key={j} className="text-[11px] text-red-600 dark:text-red-300">{msg}</li>
                        ))}
                      </ul>
                   </div>
                </div>
              ))}
            </div>
          )}

          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => {
              setResult(null);
              setFile(null);
            }}
          >
            Import Another File
          </Button>
        </div>
      )}
    </div>
  );
}
