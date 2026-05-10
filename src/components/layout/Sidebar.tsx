'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutGrid,
  PieChart,
  Settings,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Marks', href: '/marks', icon: FileSpreadsheet },
  { name: 'Classes', href: '/classes', icon: LayoutGrid },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          flex flex-col border-r border-slate-200 bg-white 
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-28 items-center px-4 border-b border-slate-50 shrink-0 overflow-hidden">
          <div className={`relative h-28 transition-all duration-300 ease-in-out ${collapsed && !isMobileOpen ? 'w-12 mx-auto' : 'w-full px-2'}`}>
            <Image 
              src="/edutrackerLogo.png" 
              alt="EduTracker Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-primary transition-standard absolute right-4"
            >
              <X size={20} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex absolute -right-3 top-14 h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-primary transition-standard z-50`}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-standard group ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'} />
                {(!collapsed || isMobileOpen) && (
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-standard group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
            {(!collapsed || isMobileOpen) && <span className="text-sm font-semibold whitespace-nowrap">Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
