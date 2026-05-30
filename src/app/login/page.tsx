'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, Mail, UserCheck, ShieldCheck, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/lib/hooks';
import { login } from '@/lib/features/authSlice';
import { loginSchema, LoginFormData } from '@/lib/validations';
import api from '@/lib/api';
import { navItems } from '@/lib/navigation';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [portal, setPortal] = useState<'ADMIN' | 'STAFF' | 'OTHER'>('STAFF');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Invalid credentials');
      }

      const { user, token } = result.data;
      const userRole = user.role.toUpperCase();

      // Enforce Portal-based access control
      if (portal === 'ADMIN' && userRole !== 'ADMIN') {
        throw new Error('This account does not have permission to access the Administration Portal.');
      }

      const staffRoles = ['PRINCIPAL', 'TEACHER', 'STAFF', 'LIBRARIAN', 'ACCOUNTANT', 'CLERK', 'SECURITY', 'CLEANER'];
      if (portal === 'STAFF' && !staffRoles.includes(userRole)) {
        throw new Error('This account is not registered as academic or administrative staff.');
      }

      // Add 'OTHER' logic here later (e.g. Students/Parents) if needed.
      if (portal === 'OTHER' && (userRole === 'ADMIN' || staffRoles.includes(userRole))) {
        throw new Error('Please use the Staff or Admin portals for this account.');
      }

      dispatch(
        login({
          user: {
            ...user,
            id: Number(user.id),
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: userRole as any,
            profileImage: user.profileImage,
            nid: user.nid || null,
            phone: user.phone || null,
            address: user.address || null,
            canLogin: user.canLogin ?? true
          },
          role: userRole as any,
          token: token,
        })
      );

      // Role-based smart redirection
      const firstAllowedItem = navItems.find(item => 
        item.roles && item.roles.includes(userRole)
      );

      if (firstAllowedItem) {
        router.push(firstAllowedItem.href);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <Card className="w-full max-w-[460px] border-slate-200/60 shadow-xl shadow-slate-200/50 p-2 sm:p-4 rounded-3xl bg-white relative z-10">
        <CardHeader className="pt-8 pb-4 text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-50 ring-8 ring-blue-50/30 overflow-hidden relative">
            <Image 
              src="/edutrackerLogo.png" 
              alt="EduTracker Logo" 
              fill
              priority
              sizes="80px"
              className="object-contain p-2"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-slate-500 font-medium mt-2">
            Login to your EduTrack AI portal
          </p>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10">
                  <Mail size={18} />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. admin@school.com"
                  {...register('email')}
                  error={errors.email?.message}
                  className="pl-11 h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10">
                  <Lock size={18} />
                </div>
                <Input
                  label="Account Password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  className="pl-11 h-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Select Access Portal</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPortal('ADMIN')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${
                      portal === 'ADMIN' 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortal('STAFF')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${
                      portal === 'STAFF' 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <UserCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortal('OTHER')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${
                      portal === 'OTHER' 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <Users size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Other</span>
                  </button>
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
