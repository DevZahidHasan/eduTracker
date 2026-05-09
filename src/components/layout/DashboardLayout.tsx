'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConfig, selectConfigInitialized } from '@/lib/features/configSlice';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const configInitialized = useAppSelector(selectConfigInitialized);

  useEffect(() => {
    if (!configInitialized) {
      dispatch(fetchConfig());
    }
  }, [dispatch, configInitialized]);

  return (
    <div className="flex h-screen overflow-hidden bg-[url('/bg-pattern.svg')] bg-cover bg-center bg-no-repeat bg-black text-foreground">
      {/* Optional: Add a subtle overlay to the background */}
      <div className="absolute inset-0 bg-black/80 z-[-1]" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
