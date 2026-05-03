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
          <label className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-xl bg-background border border-gray-700 
            text-foreground transition-all duration-300
            focus:outline-none focus:border-neon focus:glow
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
