import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppDispatch } from '@/lib/hooks';
import { linkParentThunk } from '@/lib/features/studentsSlice';
import toast from 'react-hot-toast';
import { Link as LinkIcon, Mail } from 'lucide-react';
import { Student } from '@/types/models';

interface LinkParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export function LinkParentModal({ isOpen, onClose, student }: LinkParentModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a parent email');
      return;
    }

    setLoading(true);
    try {
      await dispatch(linkParentThunk({ studentId: student.id, parentEmail: email })).unwrap();
      toast.success('Parent linked successfully');
      onClose();
      setEmail('');
    } catch (error: any) {
      toast.error(error || 'Failed to link parent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Parent Account">
      <form onSubmit={handleLink} className="space-y-6 pt-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
          <p className="text-sm text-slate-600">
            Linking parent to student: <strong className="text-slate-900">{student.fullName}</strong>
          </p>
          <p className="text-xs text-slate-500 mt-1">Class {student.className} • Sec {student.section} • Roll {student.rollNumber}</p>
        </div>

        <div className="relative group">
          <div className="absolute left-3.5 top-[38px] text-slate-400 group-focus-within:text-primary transition-standard z-10">
            <Mail size={18} />
          </div>
          <Input
            label="Parent Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="parent@example.com"
            required
            className="pl-11"
          />
          <p className="text-xs text-slate-500 mt-2">
            The parent must already have an account created with the PARENT role.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            <LinkIcon size={16} />
            {loading ? 'Linking...' : 'Link Parent'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
