'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  X,
  FileText,
  BookOpen,
  Wallet,
  Library as LibraryIcon,
  Bus as TransportIcon,
  UserPlus
} from 'lucide-react';

// ...

import { useAppSelector } from '@/lib/hooks';
import { selectRole, logout } from '@/lib/features/authSlice';
import api from '@/lib/api';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useAppDispatch } from '@/lib/hooks';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Admissions', href: '/admissions', icon: UserPlus, roles: ['ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'ID Cards', href: '/id-cards', icon: LayoutGrid, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck, roles: ['ADMIN', 'TEACHER'] },
  { name: 'Marks', href: '/marks', icon: FileSpreadsheet, roles: ['ADMIN', 'TEACHER'] },
  { name: 'Question Papers', href: '/question-papers', icon: FileText, roles: ['ADMIN', 'TEACHER'] },
  { name: 'Question Bank', href: '/question-bank', icon: BookOpen, roles: ['ADMIN', 'TEACHER'] },
  { name: 'Finance', href: '/finance', icon: Wallet, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Transport', href: '/transport', icon: TransportIcon, roles: ['ADMIN', 'PRINCIPAL'] },
  { name: 'Library', href: '/library', icon: LibraryIcon, roles: ['ADMIN', 'LIBRARIAN', 'PRINCIPAL'] },
  { name: 'Classes', href: '/classes', icon: LayoutGrid, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Reports', href: '/reports', icon: PieChart, roles: ['ADMIN', 'TEACHER', 'PRINCIPAL'] },
  { name: 'Staff', href: '/staff', icon: Users, roles: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN', 'PRINCIPAL'] },
  { name: 'Audit Logs', href: '/audit', icon: LayoutDashboard, roles: ['ADMIN'] },
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
  const router = useRouter();
  const role = useAppSelector(selectRole);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (role && item.roles.includes(role.toUpperCase()))
  );

  const dispatch = useAppDispatch();

  const handleLogoutConfirm = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, force local logout and redirect
      dispatch(logout());
      router.push('/login');
    }
  };

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
          fixed lg:relative inset-y-0 left-0 z-40 h-full
          flex flex-col border-r border-border bg-card 
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-28 items-center px-4 border-b border-border shrink-0 overflow-hidden">
          <div className={`relative h-28 transition-all duration-300 ease-in-out ${collapsed && !isMobileOpen ? 'w-12 mx-auto' : 'w-full px-2'}`}>
            <Image 
              src="/edutrackerLogo.png" 
              alt="EduTracker Logo" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 256px"
              className="object-contain"
              priority
            />
          </div>
          
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-standard absolute right-4"
            >
              <X size={20} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex absolute -right-3 top-14 h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-primary transition-standard z-50`}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-standard group ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} />
                {(!collapsed || isMobileOpen) && (
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-standard group focus:outline-none"
          >
            <LogOut size={20} className="text-muted-foreground group-hover:text-red-500" />
            {(!collapsed || isMobileOpen) && <span className="text-sm font-semibold whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from EduTrack AI?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        destructive={true}
      />
    </>
  );
}
