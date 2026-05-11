'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { login, logout, selectIsAuthenticated } from '@/lib/features/authSlice';
import api from '@/lib/api';

export default function SilentAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attempt to refresh the token first
        const refreshResponse = await api.post('/auth/refresh');
        const { token } = refreshResponse.data.data;

        // Fetch user data
        const meResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { user } = meResponse.data.data;

        dispatch(login({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
          },
          role: user.role,
          token: token
        }));
      } catch (error) {
        // If refresh fails, we're not logged in, but that's okay for silent auth
        // We only logout if we were previously thought to be authenticated
        if (isAuthenticated) {
          dispatch(logout());
        }
      } finally {
        setIsChecking(false);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      setIsChecking(false);
    }
  }, [dispatch, isAuthenticated]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
        Initializing Session...
      </div>
    );
  }

  return <>{children}</>;
}
