'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md border-neon glow">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-neon text-glow mb-2">
            Create Account
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Join EduTracker to manage your institution
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
              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500 rounded-xl">
                  Registration successful! Redirecting to login...
                </div>
              )}
              
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
              
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
                autoComplete="new-password"
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl bg-background border border-gray-700 text-foreground transition-all duration-300 focus:outline-none focus:border-neon focus:glow disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full mt-2 relative"
              disabled={isLoading || success}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            <p className="text-center text-sm text-gray-400 mt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-neon hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
