import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 rounded-md ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="border-b border-slate-50">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className={`h-4 ${i === 1 ? 'w-40' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }: { rows?: number, columns?: number }) => (
  <div className="w-full">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <Skeleton className="h-3 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Add keyframes for shimmer if not already in globals.css
// But using inline style for portability
