import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3.5 py-2 rounded-lg bg-card border border-border 
            text-foreground text-sm placeholder:text-muted-foreground
            transition-standard shadow-sm
            focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
            disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
