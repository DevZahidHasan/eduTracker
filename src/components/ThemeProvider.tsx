'use client';

import React, { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectSystemSettings } from '@/lib/features/settingsSlice';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useAppSelector(selectSystemSettings);

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply Theme Mode
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System Default
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply Accent Color
    if (settings.accentColor) {
      root.style.setProperty('--primary', settings.accentColor);
      // Optional: adjust ring or other variables if needed
      root.style.setProperty('--ring', settings.accentColor);
    }

    // Apply Compact Mode
    if (settings.compactMode === 'true') {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

  }, [settings]);

  return <>{children}</>;
}
