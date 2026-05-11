'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ExternalLink,
  Clock,
  X
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { 
  fetchNotifications, 
  markAsReadThunk, 
  markAllAsReadThunk, 
  deleteNotificationThunk,
  selectAllNotifications,
  selectUnreadCount,
  selectNotificationsLoading
} from '@/lib/features/notificationsSlice';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const loading = useAppSelector(selectNotificationsLoading);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsReadThunk(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsReadThunk());
  };

  const handleDelete = (id: number) => {
    dispatch(deleteNotificationThunk(id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'ERROR': return <XCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute top-20 right-4 w-full max-w-[400px] bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 z-50 animate-in slide-in-from-top-2 duration-300 overflow-hidden flex flex-col max-h-[600px]"
    >
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">Notifications</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {unreadCount} Unread Alerts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="h-8 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
            >
              <CheckCheck size={14} className="mr-1" />
              Mark all read
            </Button>
          )}
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing alerts...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-1">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`p-4 rounded-2xl transition-all group relative border ${
                  n.isRead ? 'bg-white border-transparent' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-bold tracking-tight leading-snug ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.isRead && (
                          <button 
                            onClick={() => handleMarkAsRead(n.id)}
                            className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(n.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${n.isRead ? 'text-slate-400 font-medium' : 'text-slate-600 font-semibold'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock size={10} />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </div>
                      {n.link && (
                        <Link 
                          href={n.link} 
                          onClick={onClose}
                          className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                        >
                          View Details
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="absolute top-4 right-4 h-2 w-2 bg-primary rounded-full group-hover:hidden"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border border-dashed border-slate-200">
              <Bell size={24} />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No notifications yet</p>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Console Alert System</p>
        </div>
      )}
    </div>
  );
}
