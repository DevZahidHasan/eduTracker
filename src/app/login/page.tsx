'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Lock, Mail, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/lib/hooks';
import { login } from '@/lib/features/authSlice';
import { Role } from '@/types/models';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid credentials');
      }

      const { user, token } = result.data;

      dispatch(
        login({
          user: {
            id: Number(user.id),
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: user.role.toUpperCase() as Role
          },
          role: user.role.toUpperCase() as Role,
          token: token,
        })
      );

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <Card className="w-full max-w-[460px] border-slate-200/60 shadow-xl shadow-slate-200/50 p-2 sm:p-4 rounded-3xl bg-white relative z-10">
        <CardHeader className="pt-8 pb-4 text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100 ring-8 ring-blue-50">
            <GraduationCap size={36} />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-slate-500 font-medium mt-2">
            Login to your EduTrack AI portal
          </p>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                  <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                  {error}
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard">
                  <Mail size={18} />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. admin@school.com"
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
                  label="Account Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex flex-col gap-1.5 w-full relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10 pointer-events-none">
                  <UserCheck size={18} />
                </div>
                <label className="text-sm font-semibold text-slate-700 ml-0.5">
                  Access Role
                </label>
                <select
                  className="w-full h-12 px-11 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-standard shadow-sm outline-none appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  required
                  disabled={isLoading}
                >
                  <option value="" disabled>Select access level</option>
                  <option value="student">Student Portal</option>
                  <option value="teacher">Staff / Teacher</option>
                  <option value="admin">System Administrator</option>
                </select>
                <div className="absolute right-3.5 top-[38px] pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5l3 3 3-3"></path></svg>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-standard group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Authorize Access
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-slate-400 font-medium">New to EduTrack AI? </span>
              <Link href="/register" className="text-sm font-bold text-primary hover:text-blue-700 transition-standard">
                Create institutional account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; 2026 EduTrack AI &bull; Enterprise Grade School Management
      </div>
    </div>
  );
}
