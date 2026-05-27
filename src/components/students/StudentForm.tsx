'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Users, Plus, MoreVertical, Search, Camera, Upload, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormData } from '@/lib/validations';
import { useAppSelector } from '@/lib/hooks';
import { selectClasses, selectGenders } from '@/lib/features/configSlice';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      profileImage: initialData?.profileImage || '',
    }
  });

  const watchClass = watch('className');
  const watchSection = watch('section');

  // Reset section when class changes
  useEffect(() => {
    if (watchClass && watchSection) {
      const classObj = CLASSES.find(c => c.value === watchClass);
      const isValidSection = classObj?.sections?.some(s => s.value === watchSection);
      if (!isValidSection) {
        setValue('section', '', { shouldValidate: true });
      }
    }
  }, [watchClass, CLASSES, setValue, watchSection]);

  useEffect(() => {
    // Only auto-generate if we are not editing an existing student
    // and both class and section are selected.
    if (!isEditing && watchClass && watchSection) {
      const fetchCredentials = async () => {
        try {
          const response = await api.get('/students/generate-credentials', {
            params: { className: watchClass, section: watchSection }
          });
          const { studentId, rollNumber } = response.data.data;
          
          setValue('studentId', studentId, { shouldValidate: true });
          setValue('rollNumber', rollNumber, { shouldValidate: true });
        } catch (error) {
          console.error('Failed to generate credentials:', error);
          toast.error('Failed to auto-generate Student ID and Roll Number');
        }
      };

      fetchCredentials();
    }
  }, [watchClass, watchSection, isEditing, setValue]);

  const onSubmitLocal = (data: StudentFormData) => {
    onSubmit(data);
  };

  const profileImage = watch('profileImage' as any);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('student-photo', file);

    setIsUploading(true);
    try {
      const response = await api.post('students/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data.data.imageUrl;
      setValue('profileImage' as any, imageUrl);
      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitLocal)} className="space-y-8 pb-4">
      {/* Section 1: Student Information */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student Identity</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative shadow-sm">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <Camera size={28} />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              )}
            </div>
            {profileImage && !isUploading && (
              <button
                type="button"
                onClick={() => setValue('profileImage' as any, '')}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Student Profile Photo</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">Upload a clear passport-sized photo. Max size 2MB (JPG, PNG).</p>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2 h-9 text-xs font-bold"
            >
              <Upload size={14} />
              {profileImage ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </div>
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
              <Select
                label="Section/Group *"
                placeholder="Choose a section"
                {...register('section')}
                error={errors.section?.message}
                options={CLASSES.find(c => c.value === watchClass)?.sections || []}
                disabled={!watchClass}
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
