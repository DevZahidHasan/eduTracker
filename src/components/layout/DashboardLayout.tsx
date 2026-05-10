'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConfig, selectConfigInitialized } from '@/lib/features/configSlice';
import { usePathname } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const configInitialized = useAppSelector(selectConfigInitialized);
  const pathname = usePathname();

  useEffect(() => {
    if (!configInitialized) {
      dispatch(fetchConfig());
    }
  }, [dispatch, configInitialized]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Sidebar Component */}
      <div className="print:hidden">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="print:hidden">
          <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar print:p-0 print:overflow-visible">
          <div className="mx-auto max-w-7xl print:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
