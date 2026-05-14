'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  showRightPanel: boolean;
  minWidth?: number;
  defaultDividerPosition?: number;
}

export function ResizableLayout({
  leftPanel,
  rightPanel,
  showRightPanel,
  minWidth = 300,
  defaultDividerPosition = 50,
}: ResizablePanelProps) {
  const [dividerPosition, setDividerPosition] = useState(defaultDividerPosition);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newRelativePosition = ((clientX - containerRect.left) / containerRect.width) * 100;

      // Constraints
      const minRelativeWidth = (minWidth / containerRect.width) * 100;
      if (newRelativePosition >= minRelativeWidth && newRelativePosition <= 100 - minRelativeWidth) {
        setDividerPosition(newRelativePosition);
      }
    },
    [isResizing, minWidth]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      window.addEventListener('touchmove', resize);
      window.addEventListener('touchend', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchmove', resize);
      window.removeEventListener('touchend', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchmove', resize);
      window.removeEventListener('touchend', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  if (!showRightPanel) {
    return <div className="w-full">{leftPanel}</div>;
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col md:flex-row w-full gap-0 overflow-hidden relative"
    >
      {/* Mobile Stacked Layout (Default/Mobile) */}
      <div className="md:hidden space-y-8 w-full">
        <div className="w-full">{leftPanel}</div>
        <div className="w-full border-t border-slate-200 pt-8">{rightPanel}</div>
      </div>

      {/* Desktop/Tablet Resizable Layout */}
      <div className="hidden md:flex w-full h-full items-start">
        <div 
          style={{ width: `${dividerPosition}%` }}
          className="overflow-y-auto pr-2"
        >
          {leftPanel}
        </div>

        <div
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className={`w-4 self-stretch cursor-col-resize hover:bg-primary/5 transition-colors group relative flex items-center justify-center ${isResizing ? 'bg-primary/10' : 'bg-transparent'}`}
        >
          <div className={`w-1 h-12 rounded-full transition-colors ${isResizing ? 'bg-primary' : 'bg-slate-300 group-hover:bg-primary/40'}`} />
          
          {/* Visual handle dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-0.5 h-0.5 rounded-full ${isResizing ? 'bg-white' : 'bg-slate-400'}`} />
            ))}
          </div>
        </div>

        <div 
          style={{ width: `${100 - dividerPosition}%` }}
          className="overflow-y-auto pl-2"
        >
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
