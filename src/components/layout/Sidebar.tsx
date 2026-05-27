'use client';


import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { navItems } from '@/lib/navigation';
import { useAppSelector } from '@/lib/hooks';
import { useAppDispatch } from '@/lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { selectRole, logout } from '@/lib/features/authSlice';
import { selectSchoolProfile } from '@/lib/features/settingsSlice';
import { ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppSelector(selectRole);
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const sidebarLogo = schoolProfile?.logo || '/edutrackerLogo.png';

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role.toUpperCase())),
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
          <div
            className={`relative h-28 transition-all duration-300 ease-in-out ${collapsed && !isMobileOpen ? 'w-12 mx-auto' : 'w-full px-2'}`}
          >
            <Image
              src={sidebarLogo}
              alt="School Logo"
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
                <Icon
                  size={20}
                  className={
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }
                />
                {(!collapsed || isMobileOpen) && (
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
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
            {(!collapsed || isMobileOpen) && (
              <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
            )}
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
