'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectRole } from '@/lib/features/authSlice';

// Define route access map. 
// Roles are expected to be uppercase ('ADMIN', 'TEACHER', etc.) to match the store.
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard': ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT'],
  '/students': ['ADMIN', 'TEACHER'],
  '/attendance': ['ADMIN', 'TEACHER'],
  '/marks': ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
  '/settings': ['ADMIN'],
  '/reports': ['ADMIN', 'TEACHER'],
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  
  // We need to delay rendering until we are mounted to avoid hydration mismatch
  // since the initial state might be read from localStorage
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Role-based access control
    const normalizedRole = role?.toUpperCase();
    const allowedRoles = ROUTE_ROLES[pathname as keyof typeof ROUTE_ROLES];
    
    if (allowedRoles && (!normalizedRole || !allowedRoles.includes(normalizedRole))) {
      // If user doesn't have the required role, redirect them to dashboard
      if (pathname !== '/dashboard') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isMounted, pathname, role, router]);

  // Show nothing while checking authentication status
  if (!isMounted || !isAuthenticated) {
    return null;
  }

  const normalizedRole = role?.toUpperCase();
  const allowedRoles = ROUTE_ROLES[pathname as keyof typeof ROUTE_ROLES];
  
  if (allowedRoles && (!normalizedRole || !allowedRoles.includes(normalizedRole))) {
    // If they are on dashboard but not allowed (fallback), show nothing
    if (pathname === '/dashboard') return null;
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
