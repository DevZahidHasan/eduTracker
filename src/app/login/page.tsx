'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/lib/hooks';
import { login, Role } from '@/lib/features/authSlice';

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
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'error@example.com') {
            reject(new Error('Invalid credentials'));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      // Dispatch login action
      dispatch(
        login({
          user: {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
          },
          role: role as Role,
          token: 'mock-jwt-token-' + Date.now(),
        })
      );

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md border-neon glow">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-neon text-glow mb-2">
            EduTracker Login
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Enter your credentials to access the system
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500 rounded-xl">
                  {error}
                </div>
              )}
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl bg-background border border-gray-700 text-foreground transition-all duration-300 focus:outline-none focus:border-neon focus:glow disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  required
                  disabled={isLoading}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full mt-2 relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-neon" xmlns="http://www.w300.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
