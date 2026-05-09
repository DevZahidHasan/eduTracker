'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated } from '@/lib/features/authSlice';
import { AlertCircle, X } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowToast(true);
      // Auto-hide toast after 4 seconds
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 bg-black border border-red-500/50 p-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] glow">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex flex-col text-left mr-4">
              <span className="font-bold text-red-500">Access Denied</span>
              <span className="text-xs text-gray-400">Please sign in or create an account to access the dashboard.</span>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="hover:text-white text-gray-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex max-w-3xl flex-col items-center justify-center gap-8 rounded-2xl border border-neon bg-black p-12 glow-strong">
        <h1 className="text-5xl font-extrabold tracking-tight text-neon text-glow sm:text-7xl">
          EduTracker
        </h1>
        <p className="max-w-xl text-lg text-cyan-100">
          The next-generation student management system. Track attendance, manage marks, and oversee
          your institution with a sleek, high-performance interface.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-neon px-8 py-3 font-bold text-black transition-all hover:bg-cyan-400 hover:glow-strong"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-neon bg-transparent px-8 py-3 font-bold text-neon transition-all hover:bg-neon/10 hover:glow"
              >
                Sign Up
              </Link>
              <button
                onClick={handleDashboardClick}
                className="rounded-lg border border-gray-700 bg-transparent px-8 py-3 font-bold text-gray-400 transition-all hover:border-gray-500 hover:text-gray-200"
              >
                View Dashboard
              </button>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-lg bg-neon px-8 py-3 font-bold text-black transition-all hover:bg-cyan-400 hover:glow-strong"
            >
              Enter Dashboard
            </Link>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link 
            href="/students" 
            onClick={handleDashboardClick}
            className="text-sm text-cyan-500 hover:text-neon hover:text-glow"
          >
            → Students
          </Link>
          <Link
            href="/attendance"
            onClick={handleDashboardClick}
            className="text-sm text-cyan-500 hover:text-neon hover:text-glow"
          >
            → Attendance
          </Link>
          <Link 
            href="/marks" 
            onClick={handleDashboardClick}
            className="text-sm text-cyan-500 hover:text-neon hover:text-glow"
          >
            → Marks
          </Link>
        </div>
      </main>
    </div>
  );
}
