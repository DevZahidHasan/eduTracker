'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';

/**
 * This component listens for global events or Redux actions.
 * Its main job is to handle 401 (Unauthorized) errors from any API call
 * and automatically log the user out.
 */
export function GlobalErrorListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = (event: PromiseRejectionEvent) => {
      // Check if the rejection is due to a 401 error from our API thunks
      if (event.reason && (event.reason === 'Authentication required' || event.reason === 'Invalid or expired token' || event.reason.includes('401'))) {
        dispatch(logout());
        router.push('/login');
      }
    };

    // Listen for unhandled promise rejections (which is how thunks often report errors)
    window.addEventListener('unhandledrejection', handleUnauthorized);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnauthorized);
    };
  }, [dispatch, router]);

  return null;
}
