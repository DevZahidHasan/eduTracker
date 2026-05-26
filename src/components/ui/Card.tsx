import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'glass' | 'elevated';
  isHoverable?: boolean;
}

export function Card({ children, className = '', variant = 'default', isHoverable = false, ...props }: CardProps) {
  const variants = {
    default: 'bg-card text-card-foreground shadow-sm border border-border',
    outline: 'bg-transparent border border-border hover:bg-slate-50/50 transition-colors',
    glass: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 shadow-sm',
    elevated: 'bg-white shadow-lg shadow-slate-200/40 border-none',
  };

  const hoverClass = isHoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';

  return (
    <div 
      className={`
        rounded-2xl p-6
        ${variants[variant]}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-6 flex flex-col gap-1.5 bg-inherit ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-xl font-bold text-foreground tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm font-medium text-muted-foreground ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-6 pt-5 border-t border-slate-100 flex items-center ${className}`}>{children}</div>;
}

// Animated Card for stagger effects
export function AnimatedCard({ children, className = '', delay = 0, ...props }: CardProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
