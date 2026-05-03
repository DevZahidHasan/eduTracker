'use client';

import { Bell, Search, UserCircle } from 'lucide-react';

export function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-cyan-800/50 bg-black/40 backdrop-blur-md px-6 transition-all">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full border border-cyan-800/50 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder-cyan-700 transition-all focus:border-neon focus:outline-none focus:glow"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-cyan-500 hover:text-neon transition-colors hover:text-glow">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-neon"></span>
        </button>
        <button className="flex items-center gap-2 text-cyan-500 hover:text-neon transition-colors">
          <UserCircle size={28} />
          <span className="text-sm font-medium">Admin</span>
        </button>
      </div>
    </header>
  );
}
