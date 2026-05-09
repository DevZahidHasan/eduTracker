'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectRole } from '@/lib/features/authSlice';

// Define route access map. 
// If a route is not in this map, it defaults to requiring authentication but allowing all roles.
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard': ['admin', 'teacher', 'parent', 'student'],
  '/students': ['admin', 'teacher'],
  '/attendance': ['admin', 'teacher'], // Perhaps students can view, but let's restrict for demonstration
  '/marks': ['admin', 'teacher', 'student', 'parent'],
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
    const allowedRoles = ROUTE_ROLES[pathname as keyof typeof ROUTE_ROLES];
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      // If user doesn't have the required role, redirect them to dashboard (or an unauthorized page)
      // If they are already on dashboard and not allowed (unlikely based on ROUTE_ROLES), this could loop, 
      // but dashboard allows all roles.
      if (pathname !== '/dashboard') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isMounted, pathname, role, router]);

  // Show nothing or a loader while checking authentication status to prevent flashing protected content
  if (!isMounted || !isAuthenticated) {
    return null;
  }

  const allowedRoles = ROUTE_ROLES[pathname as keyof typeof ROUTE_ROLES];
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
