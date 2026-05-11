import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'glass';
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-card text-card-foreground shadow-sm border border-border',
    outline: 'bg-transparent border border-border',
    glass: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 shadow-sm',
  };

  return (
    <div 
      className={`
        rounded-xl p-6 transition-standard
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-6 flex flex-col gap-1 bg-inherit ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold text-foreground tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}


export function CardContent({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-6 pt-4 border-t border-border flex items-center ${className}`}>{children}</div>;
}
