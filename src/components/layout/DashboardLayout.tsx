'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConfig, selectConfigInitialized } from '@/lib/features/configSlice';
import { fetchLicenseStatus } from '@/lib/features/licenseSlice';
import { usePathname } from 'next/navigation';
import { selectRole } from '@/lib/features/authSlice';
import { navItems } from '@/lib/navigation';
import { AccessDeniedModal } from '../ui/AccessDeniedModal';
import { LicenseLockout } from './LicenseLockout';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const dispatch = useAppDispatch();
  const configInitialized = useAppSelector(selectConfigInitialized);
  const pathname = usePathname();
  const role = useAppSelector(selectRole);
  
  const licenseStatus = useAppSelector((state) => state.license.status);

  useEffect(() => {
    if (!configInitialized) {
      dispatch(fetchConfig());
    }
  }, [dispatch, configInitialized]);

  // Fetch license on mount
  useEffect(() => {
    dispatch(fetchLicenseStatus());
  }, [dispatch]);

  // Role-based Access Control for Routes
  useEffect(() => {
    const currentNavItem = navItems.find(item => 
      pathname === item.href || pathname.startsWith(item.href + '/')
    );

    if (currentNavItem && currentNavItem.roles && role) {
      const isAuthorized = currentNavItem.roles.includes(role.toUpperCase());
      if (!isAuthorized) {
        setIsAccessDeniedOpen(true);
      } else {
        setIsAccessDeniedOpen(false);
      }
    } else {
      setIsAccessDeniedOpen(false);
    }
  }, [pathname, role]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (licenseStatus === 'EXPIRED' || licenseStatus === 'MISSING') {
    return <LicenseLockout status={licenseStatus} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans print:h-auto print:overflow-visible">
      {/* Sidebar Component */}
      <div className="print:hidden h-full">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative print:overflow-visible print:block">
        <div className="print:hidden">
          <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar print:p-0 print:overflow-visible print:block">
          <div className="mx-auto max-w-7xl print:max-w-none">
            {children}
          </div>
        </main>

        <AccessDeniedModal 
          isOpen={isAccessDeniedOpen} 
          onClose={() => setIsAccessDeniedOpen(false)} 
        />
      </div>
    </div>
  );
}
