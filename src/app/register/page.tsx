'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';
import api from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['TEACHER', 'ADMIN']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'TEACHER',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError('');

    try {
      const response = await api.post('/auth/register', data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.message || 'An error occurred during registration');
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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              {serverError && (
                <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                   <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                  {serverError}
                </div>
              )}
              {success && (
                <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <div className="h-5 w-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-lg">✓</div>
                  Account created! Redirecting to secure login...
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10">
                  <User size={18} />
                </div>
                <Input
                  label="Display Name"
                  placeholder="e.g. Dr. Jane Smith"
                  {...register('name')}
                  error={errors.name?.message}
                  className="pl-11 h-12"
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10">
                  <Mail size={18} />
                </div>
                <Input
                  label="Institutional Email"
                  type="email"
                  placeholder="name@school-domain.edu"
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
                  label="Security Password"
                  type="password"
                  placeholder="Create a strong password"
                  {...register('password')}
                  error={errors.password?.message}
                  className="pl-11 h-12"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10 pointer-events-none">
                  <ShieldCheck size={18} />
                </div>
                <Select
                  label="Administrative Position"
                  placeholder="Select position"
                  {...register('role')}
                  error={errors.role?.message}
                  className="pl-11 h-12"
                  disabled={isLoading}
                  options={[
                    { value: 'TEACHER', label: 'Academic Staff / Teacher' },
                    { value: 'ADMIN', label: 'System Administrator' },
                  ]}
                />
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
