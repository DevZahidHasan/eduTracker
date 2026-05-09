'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={`
          relative bg-[#0a0a0a] border border-neon glow
          rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden
          ${className}
        `}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-6">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-neon transition-colors p-1 rounded-lg focus:outline-none focus:glow"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
