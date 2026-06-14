"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { hrService } from '@/services/hr.service';
import { StaffMember, StaffAttendance } from '@/types/hr';
import toast from 'react-hot-toast';

export function AttendanceTab() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<Record<number, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [date]);

  async function fetchData() {
    try {
      setLoading(true);
      const [staffData, attendanceData] = await Promise.all([
        hrService.getStaff(),
        hrService.getAttendance(date)
      ]);

      setStaff(staffData);

      // Map existing attendance records
      const attMap: Record<number, { status: string; remarks: string }> = {};
      
      // Default everyone to PRESENT if no records exist
      staffData.forEach(s => {
        attMap[s.id] = { status: 'PRESENT', remarks: '' };
      });

      attendanceData.forEach(record => {
        attMap[record.userId] = { 
          status: record.status, 
          remarks: record.remarks || '' 
        };
      });

      setAttendance(attMap);
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (userId: number, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: { ...prev[userId], status }
    }));
  };

  const handleRemarksChange = (userId: number, remarks: string) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: { ...prev[userId], remarks }
    }));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const records = Object.entries(attendance).map(([userId, data]) => ({
        userId: parseInt(userId, 10),
        status: data.status,
        remarks: data.remarks
      }));

      await hrService.markAttendance(date, records);
      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Daily Attendance</h2>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-48"
            />
          </div>
          <Button onClick={saveAttendance} disabled={loading || saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Staff Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 w-48">Status</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
              ) : staff.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{member.role}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={attendance[member.id]?.status || 'PRESENT'}
                      onChange={(e) => handleStatusChange(member.id, e.target.value)}
                      options={[
                        { value: 'PRESENT', label: 'Present' },
                        { value: 'ABSENT', label: 'Absent' },
                        { value: 'LATE', label: 'Late' },
                        { value: 'HALF_DAY', label: 'Half Day' }
                      ]}
                      className={`h-9 ${
                        attendance[member.id]?.status === 'ABSENT' ? 'bg-red-50 text-red-700 border-red-200' : ''
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      placeholder="Add remarks..."
                      value={attendance[member.id]?.remarks || ''}
                      onChange={(e) => handleRemarksChange(member.id, e.target.value)}
                      className="h-9"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
