'use client';

import { Bell, Search, UserCircle, Settings, Menu } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { NotificationCenter } from './NotificationCenter';
import { selectUnreadCount, fetchNotifications } from '@/lib/features/notificationsSlice';

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-card px-4 lg:px-8 z-20 shrink-0 relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-standard"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search students, results, or analytics..."
            className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-standard focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={`relative transition-standard p-2 rounded-lg ${
            isNotificationOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white border-2 border-card">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        <NotificationCenter 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
        />
        
        {role === 'ADMIN' && (
          <Link href="/settings">
            <button className="text-muted-foreground hover:text-foreground transition-standard p-2 hover:bg-muted rounded-lg">
              <Settings size={20} />
            </button>
          </Link>
        )}
        
        <div className="h-8 w-[1px] bg-border mx-1"></div>

        <button className="flex items-center gap-3 pl-1 group">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-bold text-foreground leading-tight">{user?.name || 'User'}</span>
            <span className="text-[11px] font-medium text-muted-foreground leading-tight">{role || 'User'}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-primary transition-standard group-hover:border-primary/50 group-hover:bg-primary/5 overflow-hidden relative shrink-0">
            {user?.profileImage ? (
              <Image 
                src={user.profileImage} 
                alt={user.name || 'User'} 
                fill 
                sizes="40px"
                className="object-cover"
              />
            ) : (
              user?.name ? (
                <span className="text-sm font-black uppercase">{user.name.charAt(0)}</span>
              ) : (
                <UserCircle size={28} />
              )
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
