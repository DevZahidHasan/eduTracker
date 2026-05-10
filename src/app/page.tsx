'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated } from '@/lib/features/authSlice';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary/10 selection:text-primary">
      {/* Navbar */}
      <nav className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center">
          <div className="relative h-28 w-48">
            <Image 
              src="/edutrackerLogo.png" 
              alt="EduTracker Logo" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <a href="#features" className="hover:text-primary transition-standard">Solutions</a>
          <a href="#about" className="hover:text-primary transition-standard">Infrastructure</a>
          <a href="#security" className="hover:text-primary transition-standard">Security</a>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-sm font-black text-slate-700 hover:text-primary transition-standard">
                Sign In
              </Link>
              <Link href="/register">
                <Button className="rounded-xl shadow-lg shadow-blue-100 px-6 font-black uppercase tracking-widest text-[11px]">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button className="rounded-xl shadow-lg shadow-blue-100 px-6 font-black uppercase tracking-widest text-[11px]">
                Open Console
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 pt-24 pb-20 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-primary text-[11px] font-black uppercase tracking-[0.15em] mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} />
            Institutional ERP Redefined
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9] max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
            The standard for modern <span className="text-primary italic">academic management.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            A comprehensive, data-driven platform designed for elite educational institutions. 
            Automate attendance, grade performance, and gain real-time insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {!isAuthenticated ? (
              <>
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-200 group">
                    Deploy Institution
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-sm font-black uppercase tracking-widest border-slate-200 bg-white hover:bg-slate-50">
                    Schedule Demo
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-200">
                  Launch Dashboard
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            )}
          </div>

          {/* Dashboard Preview Placeholder */}
          <div className="mt-20 relative px-4 max-w-6xl mx-auto animate-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent z-10 h-64 -bottom-1"></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/50">
              <div className="rounded-2xl bg-slate-50 aspect-video flex items-center justify-center border border-slate-100 border-dashed relative overflow-hidden">
                <div className="relative h-32 w-32 opacity-20">
                  <Image 
                    src="/edutrackerLogo.png" 
                    alt="EduTracker Preview Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-8 py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border border-blue-100 shadow-sm">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Advanced Analytics</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Gain deep visibility into academic trends and attendance patterns across your entire institution.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Bulk Management</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Powerful class-based workflows allow teachers to process entire rosters in seconds, not hours.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Secure Infrastructure</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Enterprise-grade security ensuring student data privacy and system-wide role-based access control.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <div className="relative h-10 w-32 overflow-hidden opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
              <Image 
                src="/edutrackerLogo.png" 
                alt="EduTracker Footer Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; 2026 Built for Excellence &bull; All Systems Operational
          </div>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
             <a href="#" className="hover:text-primary">Status</a>
             <a href="#" className="hover:text-primary">Legal</a>
             <a href="#" className="hover:text-primary">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
