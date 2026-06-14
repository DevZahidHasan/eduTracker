'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, DownloadIcon, Trash2, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function BackupManager() {
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchBackups = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await api.get('/settings/backups');
      if (res.data.success) {
        setBackups(res.data.data || []);
      }
    } catch (error: any) {
      toast.error('Failed to load backups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups(false);
  }, []);

  const handleCreateBackup = async () => {
    try {
      setIsCreating(true);
      const res = await api.post('/settings/backup');
      if (res.data.success) {
        toast.success(res.data.message || 'Backup created successfully');
        fetchBackups();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create backup');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = (filename: string) => {
    // The browser will handle the download natively
    window.location.assign(`http://localhost:3000/api/settings/backups/download/${filename}`); // Note: Ensure URL is dynamic if needed or use api.defaults.baseURL
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;
    
    try {
      setIsDeleting(filename);
      await api.delete(`/settings/backups/${filename}`);
      toast.success('Backup deleted successfully');
      fetchBackups();
    } catch (error) {
      toast.error('Failed to delete backup');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-foreground text-sm">Available Backups</h4>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleCreateBackup} disabled={isCreating}>
            {isCreating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Create Backup
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchBackups(true)}>Refresh</Button>
        </div>
      </div>
      
      {backups.length === 0 ? (
        <div className="text-center p-8 bg-muted/30 rounded-lg border border-border border-dashed">
          <AlertCircle className="mx-auto text-muted-foreground mb-2" size={24} />
          <p className="text-sm text-muted-foreground">No backups found in the specified directory.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Filename</th>
                <th className="px-4 py-3 font-medium">Date Created</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {backups.map((backup) => (
                <tr key={backup.filename} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{backup.filename}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {(backup.size / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownload(backup.filename)}
                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <DownloadIcon size={14} className="mr-1" /> Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(backup.filename)}
                        disabled={isDeleting === backup.filename}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {isDeleting === backup.filename ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
