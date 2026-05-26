'use client';

import React, { useState } from 'react';
import { ShieldAlert, Key, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateLicenseKey } from '@/lib/features/licenseSlice';
import { logout } from '@/lib/features/authSlice';
import toast from 'react-hot-toast';

export function LicenseLockout({ status }: { status: 'EXPIRED' | 'MISSING' }) {
  const dispatch = useAppDispatch();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const error = useAppSelector((state) => state.license.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    const result = await dispatch(updateLicenseKey(key));
    if (updateLicenseKey.fulfilled.match(result)) {
      toast.success('License activated successfully! Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(result.payload as string || 'Failed to apply license key');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
        <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          System Locked
        </h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">
          {status === 'EXPIRED' 
            ? 'Your enterprise license has expired. Please enter a new license key to restore system access.' 
            : 'No valid license detected. The system requires an active license to operate.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter License Key"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs text-left mt-2">{error}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            loading={loading}
            disabled={!key.trim() || loading}
          >
            Activate License
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Button variant="ghost" onClick={handleLogout} className="text-slate-400">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
