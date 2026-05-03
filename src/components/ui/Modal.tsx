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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [onClose]);

  // Don't render the modal content to the DOM unless it's open, 
  // but we keep the dialog element in DOM to handle states.
  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`
        backdrop:bg-black/80 backdrop:backdrop-blur-sm
        bg-[#0a0a0a] border border-neon glow
        rounded-2xl p-0
        text-foreground w-full max-w-lg m-auto shadow-2xl
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
      <div className="p-6">
        {children}
      </div>
    </dialog>
  );
}
