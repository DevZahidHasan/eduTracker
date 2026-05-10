'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none"></div>

      <Card className="w-full max-w-[520px] border-slate-200/60 shadow-xl shadow-slate-200/50 p-2 sm:p-4 rounded-3xl bg-white relative z-10">
        <CardHeader className="pt-8 pb-4 text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-50 ring-8 ring-emerald-50/30 overflow-hidden relative">
            <Image 
              src="/edutrackerLogo.png" 
              alt="EduTracker Logo" 
              fill
              className="object-contain p-2"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Access
          </CardTitle>
          <p className="text-slate-500 font-medium mt-2">
            Create your professional EduTrack AI account
          </p>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {error && (
                <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                   <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <div className="h-5 w-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-lg">✓</div>
                  Account created! Redirecting to secure login...
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard">
                  <User size={18} />
                </div>
                <Input
                  label="Display Name"
                  type="text"
                  placeholder="e.g. Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard">
                  <Mail size={18} />
                </div>
                <Input
                  label="Institutional Email"
                  type="email"
                  placeholder="name@school-domain.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard">
                  <Lock size={18} />
                </div>
                <Input
                  label="Security Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              
              <div className="flex flex-col gap-1.5 w-full relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10 pointer-events-none">
                  <ShieldCheck size={18} />
                </div>
                <label className="text-sm font-semibold text-slate-700 ml-0.5">
                  Administrative Position
                </label>
                <select
                  className="w-full h-12 px-11 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard shadow-sm outline-none appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="TEACHER">Academic Staff / Teacher</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
                <div className="absolute right-3.5 top-[38px] pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5l3 3 3-3"></path></svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                size="lg" 
                className={`w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl transition-standard group ${success ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'shadow-blue-100'}`}
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : success ? (
                  'Account Verified'
                ) : (
                  <div className="flex items-center gap-2">
                    Register Institution
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-slate-400 font-medium">Already registered? </span>
              <Link href="/login" className="text-sm font-bold text-primary hover:text-blue-700 transition-standard">
                Sign in to your portal
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; 2026 EduTrack AI &bull; Secure Institutional Infrastructure
      </div>
    </div>
  );
}
