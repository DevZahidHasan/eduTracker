"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { hrService } from '@/services/hr.service';
import { LeaveRequest } from '@/types/hr';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { selectRole } from '@/lib/features/authSlice';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useForm, Controller } from 'react-hook-form';

export function LeaveRequestsTab() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const role = useAppSelector(selectRole);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  const canManage = role === 'ADMIN' || (role as string) === 'PRINCIPAL';

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { startDate: '', endDate: '', reason: '' }
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await hrService.getLeaves();
      setLeaves(data);
    } catch (error) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await hrService.updateLeaveStatus(id, status);
      toast.success(`Leave request ${status.toLowerCase()}`);
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const onApply = async (data: any) => {
    try {
      await hrService.applyLeave(data);
      toast.success('Leave request submitted successfully');
      setIsApplyModalOpen(false);
      reset();
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Leave Requests</h2>
          <Button onClick={() => setIsApplyModalOpen(true)}>Apply for Leave</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                {canManage && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={canManage ? 5 : 4} className="text-center py-8">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={canManage ? 5 : 4} className="text-center py-8">No leave requests found</td></tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{leave.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{leave.user?.role}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(leave.startDate).toLocaleDateString()} <br/>
                      to {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                    <td className="px-4 py-3">{getStatusBadge(leave.status)}</td>
                    {canManage && (
                      <td className="px-4 py-3 text-right">
                        {leave.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => updateStatus(leave.id, 'APPROVED')}>
                              <Check size={16} />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(leave.id, 'REJECTED')}>
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Leave">
          <form onSubmit={handleSubmit(onApply)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Start Date *</label>
              <Controller name="startDate" control={control} rules={{required:true}} render={({field}) => <Input type="date" {...field} />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">End Date *</label>
              <Controller name="endDate" control={control} rules={{required:true}} render={({field}) => <Input type="date" {...field} />} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason *</label>
              <Controller name="reason" control={control} rules={{required:true}} render={({field}) => <Input {...field} placeholder="Brief explanation..." />} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Modal>
      </CardContent>
    </Card>
  );
}
