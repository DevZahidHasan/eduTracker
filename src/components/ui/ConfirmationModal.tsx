import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = true,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 
            ${destructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
        >
          {destructive ? <AlertTriangle size={24} /> : <Info size={24} />}
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-500 mb-8 max-w-sm">
          {message}
        </p>
        
        <div className="flex w-full gap-3 sm:gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            variant={destructive ? "danger" : "primary"}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
