"use client";

import React from 'react';
import { Modal } from './Modal';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessDeniedModal({ isOpen, onClose }: AccessDeniedModalProps) {
  const router = useRouter();

  const handleGoBack = () => {
    onClose();
    router.back();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access Denied" showCloseButton={false}>
      <div className="flex flex-col items-center text-center p-4 space-y-4">
        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Restricted Module</h3>
          <p className="text-muted-foreground text-sm mt-2">
            You do not have permission to access this module. <br/>
            Please contact your school administrator or principal for access.
          </p>
        </div>
        <div className="w-full pt-4">
          <Button onClick={handleGoBack} className="w-full">
            Return to Previous Page
          </Button>
        </div>
      </div>
    </Modal>
  );
}
