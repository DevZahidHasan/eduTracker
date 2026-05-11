import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-3.5 py-2 rounded-lg bg-card border border-border 
              text-foreground text-sm appearance-none
              transition-standard shadow-sm
              focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
              disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-card text-foreground">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4.5l3 3 3-3" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
