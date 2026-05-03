'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Marks', href: '/marks', icon: FileSpreadsheet },
];

export function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col border-r border-cyan-800/50 bg-black/40 backdrop-blur-md transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-cyan-800/50 px-4">
        {!collapsed && (
          <span className="text-xl font-bold text-neon text-glow whitespace-nowrap overflow-hidden">
            EduTracker
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-cyan-400 hover:bg-cyan-900/30 hover:text-neon transition-colors"
        >
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-lg p-3 transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-900/40 border border-neon glow text-white'
                  : 'text-cyan-600 hover:bg-cyan-900/20 hover:text-cyan-400'
              }`}
            >
              <Icon size={24} className={isActive ? 'text-neon' : ''} />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cyan-800/50 p-4">
        <Link
          href="/login"
          className={`flex items-center gap-4 rounded-lg p-3 text-cyan-600 hover:bg-red-900/20 hover:text-red-400 transition-all duration-300`}
        >
          <div className="min-w-[24px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
