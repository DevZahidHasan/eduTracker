'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAuditLogs, selectAuditLogs, selectAuditLoading, selectAuditTotal } from '@/lib/features/auditSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { 
  History, 
  User as UserIcon, 
  Activity, 
  Database, 
  Calendar,
  Search,
  ArrowRight,
  FilterX
} from 'lucide-react';
import { format } from 'date-fns';

export default function AuditPage() {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectAuditLoading);
  const total = useAppSelector(selectAuditTotal);

  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    performedBy: '',
  });

  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    dispatch(fetchAuditLogs({ ...filters, limit, offset, performedBy: filters.performedBy ? Number(filters.performedBy) : undefined }));
  }, [dispatch, filters, limit, offset]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setOffset(0);
  };

  const resetFilters = () => {
    setFilters({ action: '', entityType: '', performedBy: '' });
    setOffset(0);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'UPDATE': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'DELETE': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const formatValue = (val: any) => {
    if (typeof val === 'object' && val !== null) {
      return <pre className="text-xs mt-1 p-2 bg-slate-50 rounded border border-slate-100 overflow-x-auto">{JSON.stringify(val, null, 2)}</pre>;
    }
    return <span className="text-slate-600">{String(val)}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <History size={28} />
            </div>
            System Audit Logs
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Monitor all administrative and teacher activities across the system.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Activity size={16} className="text-primary" />
          <span>{total} Total Events Logged</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/60 shadow-sm overflow-visible">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <Select
              label="Action"
              options={[
                { value: '', label: 'All Actions' },
                { value: 'CREATE', label: 'Create' },
                { value: 'UPDATE', label: 'Update' },
                { value: 'DELETE', label: 'Delete' },
              ]}
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            />
            <Select
              label="Entity Type"
              options={[
                { value: '', label: 'All Entities' },
                { value: 'Student', label: 'Student' },
                { value: 'Mark', label: 'Mark' },
                { value: 'Attendance', label: 'Attendance' },
                { value: 'MarkLock', label: 'Mark Lock' },
              ]}
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
            />
            <div className="relative group">
              <label className="block text-sm font-bold text-slate-700 mb-2">Performed By (User ID)</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Filter by User ID..."
                  value={filters.performedBy}
                  onChange={(e) => handleFilterChange('performedBy', e.target.value)}
                  className="pl-10"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-standard" size={18} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex-1 gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <FilterX size={18} />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
        
        <div className="space-y-10">
          {loading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm ml-12">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium italic">Scanning audit trails...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm ml-12">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">No activity found matching your filters</p>
              <Button variant="ghost" onClick={resetFilters} className="mt-2 text-primary">Clear all filters</Button>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="relative pl-12 group">
                {/* Timeline Dot */}
                <div className={`absolute left-[26px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ring-slate-50 z-10 transition-transform group-hover:scale-125 duration-300 ${
                  log.action === 'CREATE' ? 'bg-emerald-500' :
                  log.action === 'UPDATE' ? 'bg-amber-500' :
                  'bg-rose-500'
                }`} />

                <Card className="border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getActionColor(log.action)}`}>
                          {log.action}
                        </div>
                        <div className="flex items-center gap-2 text-slate-900">
                          <Database size={16} className="text-slate-400" />
                          <span className="font-bold">{log.entityType}</span>
                          <span className="text-slate-400 font-medium">ID: {log.entityId}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs whitespace-nowrap">
                        <Calendar size={14} />
                        {format(new Date(log.timestamp), 'MMM d, yyyy • HH:mm:ss')}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <UserIcon size={14} className="text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">Performed By</span>
                            <span className="text-sm font-bold text-slate-700">{log.user?.name || log.user?.email || `User #${log.performedBy}`}</span>
                          </div>
                          <div className="ml-auto px-2 py-0.5 bg-slate-200/50 rounded text-[9px] font-black text-slate-500">
                            {log.user?.role || 'TEACHER'}
                          </div>
                        </div>

                        {(log.oldValue || log.newValue) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.oldValue && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Previous State</label>
                                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                  {formatValue(log.oldValue)}
                                </div>
                              </div>
                            )}
                            {log.newValue && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Updated State</label>
                                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                  {formatValue(log.newValue)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>

      {total > limit && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
            className="w-full sm:w-32 border-slate-200 min-h-[44px]"
          >
            Previous
          </Button>
          <div className="text-sm font-bold text-slate-500">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </div>
          <Button
            variant="outline"
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
            className="w-full sm:w-32 border-slate-200 min-h-[44px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Internal helper for user ID filter input
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 placeholder:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-standard ${className}`}
      {...props}
    />
  );
}
