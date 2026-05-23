"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, CalendarCheck, FileText, BadgeDollarSign } from 'lucide-react';
import { StaffSalaryTab } from '@/components/hr/StaffSalaryTab';
import { AttendanceTab } from '@/components/hr/AttendanceTab';
import { LeaveRequestsTab } from '@/components/hr/LeaveRequestsTab';
import { PayrollTab } from '@/components/hr/PayrollTab';
import { useAppSelector } from '@/lib/hooks';
import { selectRole } from '@/lib/features/authSlice';

export default function HRPage() {
  const role = useAppSelector(selectRole);
  
  // Full management permissions (Admin, Accountant)
  const canManageAllHR = role === 'ADMIN' || (role as string) === 'ACCOUNTANT';
  
  // Principal permissions (Manage Leaves and Attendance)
  const isPrincipal = (role as string) === 'PRINCIPAL';
  const canManageLeaves = role === 'ADMIN' || isPrincipal;
  const canManageAttendance = role === 'ADMIN' || (role as string) === 'ACCOUNTANT' || isPrincipal;
  
  const [activeTab, setActiveTab] = useState(canManageAllHR ? 'staff' : isPrincipal ? 'attendance' : 'leaves');

  useEffect(() => {
    // Force teachers/staff to leaves tab
    if (!canManageAllHR && !isPrincipal && activeTab !== 'leaves') {
      setActiveTab('leaves');
    }
  }, [canManageAllHR, isPrincipal, activeTab]);

  const pageTitle = canManageAllHR 
    ? 'HR & Payroll' 
    : isPrincipal 
      ? 'Staff Management' 
      : 'My Leaves';

  const pageDesc = canManageAllHR
    ? 'Manage staff salaries, attendance, leaves, and payroll records'
    : isPrincipal
      ? 'Manage staff attendance and approve leave requests'
      : 'Apply for and track your leave requests';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted-foreground text-sm">{pageDesc}</p>
      </div>

      <div className="flex border-b border-border gap-6 overflow-x-auto custom-scrollbar">
        {canManageAllHR && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'staff' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase size={16} /> Staff & Salary
          </button>
        )}

        {canManageAttendance && (
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'attendance' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarCheck size={16} /> Daily Attendance
          </button>
        )}
        
        {/* Visible to everyone (Teachers see own, Principal/Admin see all) */}
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'leaves' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText size={16} /> {isPrincipal || canManageAllHR ? 'Staff Leave Requests' : 'Leave Requests'}
        </button>

        {canManageAllHR && (
          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'payroll' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BadgeDollarSign size={16} /> Payroll Generator
          </button>
        )}
      </div>

      <div className="pt-2">
        {activeTab === 'staff' && canManageAllHR && <StaffSalaryTab />}
        {activeTab === 'attendance' && canManageAttendance && <AttendanceTab />}
        {activeTab === 'leaves' && <LeaveRequestsTab />}
        {activeTab === 'payroll' && canManageAllHR && <PayrollTab />}
      </div>
    </div>
  );
}
