"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { hrService } from '@/services/hr.service';
import { StaffMember } from '@/types/hr';
import toast from 'react-hot-toast';
import { Edit2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

export function StaffSalaryTab() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      baseSalary: 0,
      allowances: 0,
      deductions: 0
    }
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await hrService.getStaff();
      setStaff(data);
    } catch (error) {
      toast.error('Failed to load staff records');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (member: StaffMember) => {
    setSelectedStaff(member);
    reset({
      baseSalary: member.salary?.baseSalary || 0,
      allowances: member.salary?.allowances || 0,
      deductions: member.salary?.deductions || 0
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    if (!selectedStaff) return;
    try {
      await hrService.updateSalary(selectedStaff.id, data);
      toast.success('Salary updated successfully');
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      toast.error('Failed to update salary');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-bold mb-4">Staff & Salary Configuration</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Base Salary</th>
                <th className="px-4 py-3">Allowances</th>
                <th className="px-4 py-3">Deductions</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No staff found</td></tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </td>
                    <td className="px-4 py-3">{member.role}</td>
                    <td className="px-4 py-3 font-mono">${member.salary?.baseSalary.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 font-mono text-green-600">${member.salary?.allowances.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 font-mono text-red-600">${member.salary?.deductions.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>
                        <Edit2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configure Salary: ${selectedStaff?.name}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Base Salary ($)</label>
              <Controller name="baseSalary" control={control} render={({field}) => <Input type="number" {...field} />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Monthly Allowances ($)</label>
              <Controller name="allowances" control={control} render={({field}) => <Input type="number" {...field} />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Standard Deductions ($)</label>
              <Controller name="deductions" control={control} render={({field}) => <Input type="number" {...field} />} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </Modal>
      </CardContent>
    </Card>
  );
}
