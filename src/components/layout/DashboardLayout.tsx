'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConfig, selectConfigInitialized } from '@/lib/features/configSlice';
import { fetchLicenseStatus } from '@/lib/features/licenseSlice';
import { fetchSchoolProfile, selectSchoolProfile, fetchSystemSettings, selectSystemSettings } from '@/lib/features/settingsSlice';
import { usePathname } from 'next/navigation';
import { selectRole } from '@/lib/features/authSlice';
import { navItems } from '@/lib/navigation';
import { AccessDeniedModal } from '../ui/AccessDeniedModal';
import { LicenseLockout } from './LicenseLockout';
import Image from 'next/image';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const dispatch = useAppDispatch();
  const configInitialized = useAppSelector(selectConfigInitialized);
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const systemSettings = useAppSelector(selectSystemSettings);
  const pathname = usePathname();
  const role = useAppSelector(selectRole);
  
  const licenseStatus = useAppSelector((state) => state.license.status);

  useEffect(() => {
    if (!configInitialized) {
      dispatch(fetchConfig());
    }
  }, [dispatch, configInitialized]);

  // Fetch license, school profile, and system settings on mount
  useEffect(() => {
    dispatch(fetchLicenseStatus());
    dispatch(fetchSchoolProfile());
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  // ... (RBAC useEffect) ...
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

  // Apply accent color to document root
  useEffect(() => {
    const accentColor = systemSettings?.accentColor || '#2563eb';
    document.documentElement.style.setProperty('--primary', accentColor);
    
    // Also update primary-hover for buttons (approximate darkening)
    const hoverColor = accentColor === '#2563eb' ? '#1d4ed8' : accentColor + 'ee';
    document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
  }, [systemSettings.accentColor]);

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

        {/* Global Branding Footer (Always Visible) */}
        <footer className="h-14 px-6 border-t border-border bg-card flex flex-row justify-between items-center text-muted-foreground print:hidden shrink-0 z-10">
          <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
             <span className="text-[10px] font-bold uppercase tracking-widest">Powered by</span>
             <div className="flex items-center gap-2 grayscale contrast-125">
               <Image src="/edutrackerLogo.png" alt="EduTracker AI" width={22} height={22} className="object-contain" />
               <span className="text-sm font-black tracking-tight text-foreground/80">EduTracker AI</span>
             </div>
          </div>
          <div className="flex items-center gap-5">
             <span className="hidden sm:inline text-[10px] font-medium tracking-wide uppercase opacity-60">© 2026 All Rights Reserved</span>
             <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-tighter uppercase shadow-sm">
                v1.0.0
             </div>
          </div>
        </footer>

        <AccessDeniedModal 
          isOpen={isAccessDeniedOpen} 
          onClose={() => setIsAccessDeniedOpen(false)} 
        />
      </div>
    </div>
  );
}
