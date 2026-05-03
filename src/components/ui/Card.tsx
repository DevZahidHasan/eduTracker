import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowOnHover?: boolean;
}

export function Card({ children, className = '', glowOnHover = false, ...props }: CardProps) {
  return (
    <div 
      className={`
        bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6
        transition-all duration-300
        ${glowOnHover ? 'hover:border-neon hover:glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 flex flex-col gap-1.5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-xl font-semibold text-foreground ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-6 pt-4 border-t border-gray-800 flex items-center ${className}`}>{children}</div>;
}
