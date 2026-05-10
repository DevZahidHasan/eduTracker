'use client';

import { Bell, Search, UserCircle, Settings, Menu } from 'lucide-react';

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8 z-20 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-standard"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search students, results, or analytics..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 transition-standard focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-slate-500 hover:text-slate-900 transition-standard p-2 hover:bg-slate-50 rounded-lg">
          <Bell size={20} />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary border-2 border-white"></span>
        </button>
        <button className="text-slate-500 hover:text-slate-900 transition-standard p-2 hover:bg-slate-50 rounded-lg">
          <Settings size={20} />
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

        <button className="flex items-center gap-3 pl-1 group">
          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-bold text-slate-900 leading-tight">Admin User</span>
            <span className="text-[11px] font-medium text-slate-500 leading-tight">Super Admin</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary transition-standard group-hover:border-primary/50 group-hover:bg-primary/5">
            <UserCircle size={28} />
          </div>
        </button>
      </div>
    </header>
  );
}
