'use client';

import React from 'react';
import { Users, Plus, MoreVertical, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormData } from '@/lib/validations';
import { useAppSelector } from '@/lib/hooks';
import { selectClasses, selectGenders } from '@/lib/features/configSlice';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<StudentFormData>;
  isEditing?: boolean;
  hideClassAndSection?: boolean;
}

export function StudentForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false,
  hideClassAndSection = false
}: StudentFormProps) {
  const CLASSES = useAppSelector(selectClasses);
  const GENDERS = useAppSelector(selectGenders);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      studentId: initialData?.studentId || '',
      rollNumber: initialData?.rollNumber || '',
      className: initialData?.className || '',
      section: initialData?.section || '',
      gender: initialData?.gender || 'MALE',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      parentName: initialData?.parentName || '',
      parentPhone: initialData?.parentPhone || '',
      address: initialData?.address || '',
      bloodGroup: initialData?.bloodGroup || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      admissionDate: initialData?.admissionDate || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-4">
      {/* Section 1: Student Information */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student Identity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2">
            <Input 
              label="Full Name *"
              placeholder="e.g. Johnathan Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
          </div>
          <Select
            label="Gender *"
            placeholder="Select gender"
            {...register('gender')}
            error={errors.gender?.message}
            options={GENDERS}
          />
          <Input 
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
          />
          <Input 
            label="Blood Group"
            placeholder="e.g. O+"
            {...register('bloodGroup')}
            error={errors.bloodGroup?.message}
          />
          <Input 
            label="Profile Image URL"
            placeholder="https://images.unsplash.com/..."
            {...register('profileImage' as any)}
            error={(errors as any).profileImage?.message}
          />
        </div>
      </div>

      {/* Section 2: Academic Information */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <Plus size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Academic Records</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input 
            label="Official Student ID *"
            placeholder="STU-00000"
            {...register('studentId')}
            error={errors.studentId?.message}
          />
          <Input 
            label="Class Roll Number *"
            placeholder="e.g. 10"
            {...register('rollNumber')}
            error={errors.rollNumber?.message}
          />
          
          {!hideClassAndSection && (
            <>
              <Select
                label="Assigned Class *"
                placeholder="Choose a class"
                {...register('className')}
                error={errors.className?.message}
                options={CLASSES}
              />
              <Input 
                label="Section/Group *"
                placeholder="e.g. A"
                {...register('section')}
                error={errors.section?.message}
              />
            </>
          )}

          <div className="md:col-span-2">
            <Input 
              label="Admission Date"
              type="date"
              {...register('admissionDate')}
              error={errors.admissionDate?.message}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Guardian Details */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <MoreVertical size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Guardian Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input 
            label="Parent/Guardian Name"
            placeholder="Jane Doe"
            {...register('parentName')}
            error={errors.parentName?.message}
          />
          <Input 
            label="Guardian Contact Number"
            placeholder="+1 000-000-000"
            {...register('parentPhone')}
            error={errors.parentPhone?.message}
          />
        </div>
      </div>

      {/* Section 4: Contact Info */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-8 w-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
            <Search size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Contact & Communication</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input 
            label="Personal Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input 
            label="Primary Phone Number"
            placeholder="+1 000-000-000"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <div className="md:col-span-2">
            <Input 
              label="Residential Address"
              placeholder="Complete street address, city, and zip"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto px-8 shadow-lg shadow-blue-100 min-h-[44px]">
          {isEditing ? 'Update Records' : 'Confirm Registration'}
        </Button>
      </div>
    </form>
  );
}
