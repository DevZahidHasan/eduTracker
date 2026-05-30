'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchParentDashboard, 
  selectParentDashboardData, 
  fetchParentFees, 
  selectParentFeesData,
  selectParentFeesLoading
} from '@/lib/features/parentSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  AlertCircle, 
  Wallet, 
  Receipt, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

export default function ParentFeesView() {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectParentDashboardData);
  const feesData = useAppSelector(selectParentFeesData);
  const loading = useAppSelector(selectParentFeesLoading);
  
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchParentDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(dashboardData[0].student.id);
    }
  }, [dashboardData, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(fetchParentFees({ studentId: selectedStudentId }));
    }
  }, [dispatch, selectedStudentId]);

  if (dashboardData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No Students Linked</h3>
      </div>
    );
  }

  const studentOptions = dashboardData.map(d => ({
    value: d.student.id.toString(),
    label: d.student.fullName
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PARTIAL': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'UNPAID': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getMonthName = (month: number) => {
    return format(new Date(2000, month - 1, 1), 'MMMM');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {dashboardData.length > 1 && (
            <div className="w-full sm:w-48">
              <Select
                value={selectedStudentId?.toString() || ''}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                options={studentOptions}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee History List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
            <Receipt size={20} className="text-primary" />
            Billing History
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : feesData.length === 0 ? (
            <Card className="border-slate-200/60 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Wallet size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Billing Records</h3>
                <p className="text-slate-500 text-sm mt-1">There are no fee vouchers generated for this student yet.</p>
              </CardContent>
            </Card>
          ) : (
            feesData.map((voucher) => (
              <Card key={voucher.id} className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${getStatusColor(voucher.status)}`}>
                        {voucher.status === 'PAID' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {getMonthName(voucher.month)} {voucher.year} Fees
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Due Date: {format(new Date(voucher.dueDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">৳ {voucher.totalAmount.toLocaleString()}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getStatusColor(voucher.status)}`}>
                          {voucher.status}
                        </span>
                      </div>
                      {voucher.status !== 'PAID' && (
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                          <CreditCard size={14} /> Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Detailed breakdown (optional/expandable) */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                    <div className="space-y-2">
                      {voucher.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-xs font-medium">
                          <span className="text-slate-500">{item.feeType.name}</span>
                          <span className="text-slate-700">৳ {item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-black">
                        <span className="text-slate-900">Total Paid</span>
                        <span className="text-emerald-600">৳ {voucher.paidAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Payments & Stats Side Column */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-widest">Balance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-black">
                  ৳ {feesData.reduce((acc, v) => acc + (v.status !== 'PAID' ? v.totalAmount - v.paidAmount : 0), 0).toLocaleString()}
                </p>
                <p className="text-slate-400 text-xs font-medium mt-1">Total Outstanding Dues</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                Pay All Dues
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {feesData.flatMap(v => v.payments).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 5).map((payment: any) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">৳ {payment.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight">{payment.paymentMethod} • {format(new Date(payment.paymentDate), 'MMM dd')}</p>
                    </div>
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                ))}
                {feesData.every(v => v.payments.length === 0) && (
                  <div className="p-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No payment history
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
