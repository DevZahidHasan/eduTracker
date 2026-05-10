'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <DashboardLayout>
        <AnimatedPage key={pathname}>{children}</AnimatedPage>
      </DashboardLayout>
    </AuthGuard>
  );
}

