import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-md active:scale-[0.98]',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98]',
    soft: 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5',
    icon: 'p-2.5',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
}
