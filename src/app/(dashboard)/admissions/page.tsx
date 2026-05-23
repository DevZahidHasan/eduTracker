"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Plus, Search, Filter, Edit, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { admissionsService } from '@/services/admissions.service';
import { Inquiry, InquiryStatus, InquirySource } from '@/types/admissions';
import { Modal } from '@/components/ui/Modal';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchClassesOverview, selectClassesOverview } from '@/lib/features/classesSlice';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentFormData } from '@/lib/validations';

const inquirySchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().optional(),
  interestedGrade: z.string().min(1, 'Interested grade is required'),
  previousSchool: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional()
});

const admitSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  rollNumber: z.string().min(1, 'Roll Number is required'),
  className: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
});

export default function AdmissionsPage() {
  const dispatch = useAppDispatch();
  const classesOverview = useAppSelector(selectClassesOverview);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Modals state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      studentName: '', parentName: '', phone: '', email: '',
      interestedGrade: '', previousSchool: '', source: 'OTHER', notes: '', status: 'NEW'
    }
  });

  const admitForm = useForm({
    resolver: zodResolver(admitSchema),
    defaultValues: {
      studentId: '', rollNumber: '', className: '', section: '', gender: 'MALE', address: ''
    }
  });

  useEffect(() => {
    fetchInquiries();
    dispatch(fetchClassesOverview());
  }, [dispatch]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await admissionsService.getInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      const matchesSearch = 
        inquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm) ||
        inquiry.inquiryNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus ? inquiry.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, filterStatus]);

  // Options mapped from backend classes
  const classOptions = useMemo(() => {
    return [
      { value: '', label: 'Select Class' },
      ...classesOverview.map(c => ({ value: c.className, label: c.className }))
    ];
  }, [classesOverview]);

  const selectedAdmitClass = admitForm.watch('className');
  const sectionOptions = useMemo(() => {
    const classData = classesOverview.find(c => c.className === selectedAdmitClass);
    const options = classData ? classData.sections.map(s => ({ value: s.section, label: `Section ${s.section}` })) : [];
    return [{ value: '', label: 'Select Section' }, ...options];
  }, [classesOverview, selectedAdmitClass]);

  const openAddModal = () => {
    reset({
      studentName: '', parentName: '', phone: '', email: '',
      interestedGrade: '', previousSchool: '', source: 'OTHER', notes: '', status: 'NEW'
    });
    setSelectedInquiry(null);
    setIsInquiryModalOpen(true);
  };

  const openEditModal = (inquiry: Inquiry) => {
    reset({
      studentName: inquiry.studentName,
      parentName: inquiry.parentName,
      phone: inquiry.phone,
      email: inquiry.email || '',
      interestedGrade: inquiry.interestedGrade,
      previousSchool: inquiry.previousSchool || '',
      source: inquiry.source,
      notes: inquiry.notes || '',
      status: inquiry.status
    });
    setSelectedInquiry(inquiry);
    setIsInquiryModalOpen(true);
  };

  const openAdmitModal = (inquiry: Inquiry) => {
    admitForm.reset({
      studentId: '', rollNumber: '', className: inquiry.interestedGrade, section: '', gender: 'MALE', address: ''
    });
    setSelectedInquiry(inquiry);
    setIsAdmitModalOpen(true);
  };

  const onSubmitInquiry = async (data: any) => {
    try {
      if (selectedInquiry) {
        await admissionsService.updateInquiry(selectedInquiry.id, data);
        toast.success('Inquiry updated successfully');
      } else {
        await admissionsService.createInquiry(data);
        toast.success('Inquiry created successfully');
      }
      setIsInquiryModalOpen(false);
      fetchInquiries();
    } catch (error) {
      toast.error(selectedInquiry ? 'Failed to update' : 'Failed to create');
    }
  };

  const onSubmitAdmit = async (data: any) => {
    if (!selectedInquiry) return;
    try {
      await admissionsService.admitInquiry(selectedInquiry.id, data);
      toast.success('Student admitted successfully!');
      setIsAdmitModalOpen(false);
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to admit student');
    }
  };

  const handleDelete = async () => {
    if (!selectedInquiry) return;
    try {
      await admissionsService.deleteInquiry(selectedInquiry.id);
      toast.success('Inquiry deleted successfully');
      setIsDeleteModalOpen(false);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'INTERESTED': return 'bg-purple-100 text-purple-800';
      case 'ADMITTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': case 'NOT_INTERESTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions & Leads</h1>
          <p className="text-muted-foreground text-sm">Manage new inquiries and student admissions</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={16} /> New Inquiry
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'NEW', label: 'New' },
                  { value: 'CONTACTED', label: 'Contacted' },
                  { value: 'INTERESTED', label: 'Interested' },
                  { value: 'ADMITTED', label: 'Admitted' },
                  { value: 'NOT_INTERESTED', label: 'Not Interested' },
                ]}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">Inquiry #</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Parent Name & Phone</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">No inquiries found</td></tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{inquiry.inquiryNumber}</td>
                      <td className="px-4 py-3">{inquiry.studentName}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>{inquiry.parentName}</span>
                          <span className="text-muted-foreground text-xs">{inquiry.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{inquiry.interestedGrade}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {inquiry.status !== 'ADMITTED' && (
                            <Button variant="outline" size="sm" onClick={() => openAdmitModal(inquiry)} className="h-8 border-green-500 text-green-600 hover:bg-green-50">
                              <CheckCircle size={14} className="mr-1"/> Admit
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(inquiry)} className="h-8 w-8">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedInquiry(inquiry); setIsDeleteModalOpen(true); }} className="h-8 w-8 text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Form Modal */}
      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} title={selectedInquiry ? 'Edit Inquiry' : 'New Inquiry'}>
        <form onSubmit={handleSubmit(onSubmitInquiry)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Student Name *</label>
              <Controller name="studentName" control={control} render={({field}) => <Input {...field} placeholder="John Doe" />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Parent Name *</label>
              <Controller name="parentName" control={control} render={({field}) => <Input {...field} placeholder="Jane Doe" />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone *</label>
              <Controller name="phone" control={control} render={({field}) => <Input {...field} placeholder="+1234567890" />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Controller name="email" control={control} render={({field}) => <Input {...field} placeholder="email@example.com" />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Interested Grade *</label>
              <Controller name="interestedGrade" control={control} render={({field}) => (
                <Select {...field} options={classOptions} />
              )} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Source</label>
              <Controller name="source" control={control} render={({field}) => (
                <Select {...field} options={[
                  { value: 'WALK_IN', label: 'Walk-In' }, { value: 'PHONE', label: 'Phone' },
                  { value: 'WEBSITE', label: 'Website' }, { value: 'FACEBOOK', label: 'Facebook' },
                  { value: 'REFERENCE', label: 'Reference' }, { value: 'OTHER', label: 'Other' }
                ]} />
              )} />
            </div>
            {selectedInquiry && (
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Controller name="status" control={control} render={({field}) => (
                  <Select {...field} options={[
                    { value: 'NEW', label: 'New' }, { value: 'CONTACTED', label: 'Contacted' },
                    { value: 'INTERESTED', label: 'Interested' }, { value: 'NOT_INTERESTED', label: 'Not Interested' },
                    { value: 'REJECTED', label: 'Rejected' }
                  ]} />
                )} />
              </div>
            )}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Previous School</label>
              <Controller name="previousSchool" control={control} render={({field}) => <Input {...field} placeholder="Previous School Name" />} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Controller name="notes" control={control} render={({field}) => <Input {...field} placeholder="Any discussion notes..." />} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsInquiryModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Inquiry</Button>
          </div>
        </form>
      </Modal>

      {/* Admit Student Modal */}
      <Modal 
        isOpen={isAdmitModalOpen} 
        onClose={() => setIsAdmitModalOpen(false)} 
        title={`Admit ${selectedInquiry?.studentName}`}
        size="4xl"
      >
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            You are admitting <strong>{selectedInquiry?.studentName}</strong>. 
            Data from the inquiry has been pre-filled. Please review and complete the admission form.
          </p>
        </div>
        
        {isAdmitModalOpen && selectedInquiry && (
          <StudentForm
            onSubmit={onSubmitAdmit}
            onCancel={() => setIsAdmitModalOpen(false)}
            initialData={{
              fullName: selectedInquiry.studentName,
              className: selectedInquiry.interestedGrade,
              parentName: selectedInquiry.parentName,
              parentPhone: selectedInquiry.phone,
              phone: selectedInquiry.phone,
              email: selectedInquiry.email || '',
              gender: 'MALE', // Default fallback
            }}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
        confirmText="Delete"
        destructive
      />
    </div>
  );
}
