'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Filter, 
  Download, 
  Receipt, 
  CreditCard, 
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Edit2,
  Trash2,
  Settings as SettingsIcon,
  ChevronRight,
  Eye,
  Search
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchFeeTypes, 
  fetchFeeStructures, 
  fetchFinanceStats, 
  generateVouchers,
  createFeeType,
  upsertFeeStructure,
  fetchAllVouchers,
  deleteVoucher,
  selectFeeTypes,
  selectFeeStructures,
  selectVouchers,
  selectFinanceStats,
  selectFinanceLoading
} from '@/lib/features/financeSlice';
import { selectClasses, fetchConfig } from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type TabId = 'dashboard' | 'vouchers' | 'payments' | 'setup';

export default function FinancePage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Redux Selectors
  const classes = useAppSelector(selectClasses);
  const feeTypes = useAppSelector(selectFeeTypes);
  const feeStructures = useAppSelector(selectFeeStructures);
  const vouchers = useAppSelector(selectVouchers);
  const stats = useAppSelector(selectFinanceStats);
  const loading = useAppSelector(selectFinanceLoading);

  // Local State
  const [selectedClass, setSelectedClass] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [setupSubTab, setSetupSubTab] = useState<'types' | 'structures'>('types');
  const [feeTypeModalOpen, setFeeTypeModalOpen] = useState(false);
  const [isEditingFeeType, setIsEditingFeeType] = useState(false);
  const [selectedFeeTypeId, setSelectedFeeTypeId] = useState<number | null>(null);
  const [feeStructureModalOpen, setFeeStructureModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [deleteVoucherModalOpen, setDeleteVoucherModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);
  
  const [voucherData, setVoucherData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0]
  });

  const [newFeeType, setNewFeeType] = useState({ name: '', isMonthly: true });
  const [editingStructure, setEditingStructure] = useState({ feeTypeId: '', amount: '' });

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(fetchFeeTypes());
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  // Sync fee structures when class changes
  useEffect(() => {
    if (selectedClass && activeTab === 'setup') {
      dispatch(fetchFeeStructures(selectedClass));
    }
  }, [selectedClass, activeTab, dispatch]);

  // Fetch vouchers when filters change
  useEffect(() => {
    if (activeTab === 'vouchers') {
      dispatch(fetchAllVouchers({ className: selectedClass, status: statusFilter }));
    }
  }, [selectedClass, statusFilter, activeTab, dispatch]);

  const handleCreateFeeType = async () => {
    if (!newFeeType.name) return;
    try {
      if (isEditingFeeType && selectedFeeTypeId) {
        await api.put(`/finance/fee-types/${selectedFeeTypeId}`, newFeeType);
        toast.success('Fee category updated');
      } else {
        await dispatch(createFeeType(newFeeType)).unwrap();
        toast.success('Fee category saved');
      }
      setFeeTypeModalOpen(false);
      setIsEditingFeeType(false);
      setSelectedFeeTypeId(null);
      setNewFeeType({ name: '', isMonthly: true });
      dispatch(fetchFeeTypes());
    } catch (err: any) {
      toast.error(err || 'Failed to save');
    }
  };

  const handleUpdateStructure = async () => {
    if (!selectedClass || !editingStructure.feeTypeId || !editingStructure.amount) return;
    try {
      await dispatch(upsertFeeStructure({
        className: selectedClass,
        feeTypeId: Number(editingStructure.feeTypeId),
        amount: Number(editingStructure.amount)
      })).unwrap();
      toast.success('Price updated');
      setFeeStructureModalOpen(false);
      dispatch(fetchFeeStructures(selectedClass));
    } catch (err: any) {
      toast.error(err || 'Failed to update');
    }
  };

  const handleGenerateVouchers = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    try {
      const result = await dispatch(generateVouchers({
        className: selectedClass,
        ...voucherData
      })).unwrap();
      toast.success(`${result.count} vouchers generated successfully`);
      setVoucherModalOpen(false);
      dispatch(fetchFinanceStats());
    } catch (err: any) {
      toast.error(err || 'Failed to generate vouchers');
    }
  };

  const handleDeleteVoucher = async () => {
    if (!voucherToDelete) return;
    try {
      await dispatch(deleteVoucher(voucherToDelete)).unwrap();
      toast.success('Voucher deleted');
      setDeleteVoucherModalOpen(false);
      setVoucherToDelete(null);
      dispatch(fetchAllVouchers({ className: selectedClass, status: statusFilter }));
      dispatch(fetchFinanceStats());
    } catch (err: any) {
      toast.error(err || 'Failed to delete');
    }
  };

  const TABS = [
    { id: 'dashboard', label: 'Overview', icon: TrendingUp },
    { id: 'vouchers', label: 'Vouchers', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'setup', label: 'Fee Setup', icon: Plus },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Finance Management</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage institutional revenue, student fees, and collections.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Download size={18} className="mr-2" /> Export Report
          </Button>
          <Button onClick={() => setVoucherModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Generate Monthly Vouchers
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-max">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Billed</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">${stats?.totalBilled.toLocaleString() || '0.00'}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Current Academic Cycle</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collected</span>
                </div>
                <h3 className="text-2xl font-black text-emerald-600">${stats?.totalCollected.toLocaleString() || '0.00'}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{stats?.collectionRate.toFixed(1)}% Collection Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Clock size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                </div>
                <h3 className="text-2xl font-black text-amber-600">${stats?.totalPending.toLocaleString() || '0.00'}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Outstanding Dues</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm border-l-4 border-l-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    <Receipt size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vouchers</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{stats?.voucherStats.paid || 0} / {stats?.voucherStats.total || 0}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Paid vs Total Issued</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Collections</CardTitle>
                  <CardDescription>Latest fee payments recorded in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-400">
                    <History size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No recent payments found.</p>
                  </div>
                </CardContent>
             </Card>

             <Card className="bg-primary text-white shadow-xl shadow-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Accountant AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">
                    Based on current trends, your collection rate is **{stats?.collectionRate.toFixed(1)}%**.
                    We recommend sending SMS reminders to Class {selectedClass || 'all'} students for the upcoming month.
                  </p>
                  <Button variant="secondary" className="w-full font-bold">
                    View Delinquent List
                  </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {/* Vouchers Management */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm">
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Class</label>
                  <Select 
                    placeholder="All Classes"
                    options={classes}
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                  <Select 
                    placeholder="Any Status"
                    options={[
                      { value: '', label: 'All Vouchers' },
                      { value: 'PAID', label: 'Paid' },
                      { value: 'PARTIAL', label: 'Partial' },
                      { value: 'UNPAID', label: 'Unpaid' },
                      { value: 'OVERDUE', label: 'Overdue' },
                    ]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="h-10">
                  <Download size={16} className="mr-2" /> Export CSV
                </Button>
             </div>
          </Card>

          <Card className="overflow-hidden border-slate-200/60 shadow-sm p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Student Details</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Voucher ID</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Month/Year</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Amount</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Paid</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Status</th>
                      <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} columns={7} />)
                    ) : vouchers.length > 0 ? (vouchers as any[]).map((v: any) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-900">{v.student.fullName}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{v.student.className} • Roll: {v.student.rollNumber}</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{v.id.substring(0, 8)}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{new Date(0, v.month-1).toLocaleString('default', {month:'long'})} {v.year}</td>
                        <td className="px-6 py-4 font-black text-slate-900">${v.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">${v.paidAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={`
                              px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                              ${v.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                                v.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 
                                v.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}
                           `}>
                             {v.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                           <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="View Details"><Eye size={16} /></button>
                           <button 
                            onClick={() => {
                              setVoucherToDelete(v.id);
                              setDeleteVoucherModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                            title="Delete Voucher"
                           >
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No vouchers found matching the filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </Card>
        </div>
      )}

      {/* Setup Tab */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <div className="flex bg-slate-50 p-1 rounded-xl w-max border border-slate-200">
            <button 
              onClick={() => setSetupSubTab('types')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${setupSubTab === 'types' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Fee Types
            </button>
            <button 
              onClick={() => setSetupSubTab('structures')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${setupSubTab === 'structures' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Class-wise Pricing
            </button>
          </div>

          {setupSubTab === 'types' ? (
            <Card className="overflow-hidden border-slate-200/60 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Institutional Fee Items</CardTitle>
                  <CardDescription>Define global fee categories (e.g. Tuition, Bus, Uniform).</CardDescription>
                </div>
                <Button size="sm" onClick={() => {
                  setNewFeeType({ name: '', isMonthly: true });
                  setIsEditingFeeType(false);
                  setFeeTypeModalOpen(true);
                }}>
                  <Plus size={16} className="mr-1" /> Add Category
                </Button>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                {feeTypes.length > 0 ? feeTypes.map((type: any) => (
                  <div key={type.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <SettingsIcon size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{type.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {type.isMonthly ? 'Recurring Monthly' : 'One-time / Occasional'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setNewFeeType({ name: type.name, isMonthly: type.isMonthly });
                          setIsEditingFeeType(true);
                          setSelectedFeeTypeId(type.id);
                          setFeeTypeModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-400 italic text-sm">No fee categories defined.</div>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-slate-200/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Select Class to Manage Pricing</label>
                      <Select 
                        placeholder="Choose Class..."
                        options={classes}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      />
                    </div>
                    <div className="pt-5">
                      <Button 
                        disabled={!selectedClass} 
                        onClick={() => setFeeStructureModalOpen(true)}
                      >
                        <Plus size={16} className="mr-2" /> Set Fee for {selectedClass || 'Class'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedClass && (
                <Card className="overflow-hidden border-slate-200/60 shadow-sm">
                   <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-lg">Fee Structure for {selectedClass}</CardTitle>
                      <CardDescription>Current active pricing for this grade level.</CardDescription>
                   </CardHeader>
                   <div className="divide-y divide-slate-100">
                      {feeStructures.length > 0 ? (feeStructures as any[]).map((s) => (
                        <div key={s.id} className="p-4 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <span className="font-bold text-slate-900">{s.feeType.name}</span>
                              <ChevronRight size={14} className="text-slate-300" />
                              <span className="text-lg font-black text-primary">${s.amount.toLocaleString()}</span>
                           </div>
                           <button 
                            onClick={() => {
                              setEditingStructure({ feeTypeId: String(s.feeTypeId), amount: String(s.amount) });
                              setFeeStructureModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                           >
                             <Edit2 size={16} />
                           </button>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-slate-400 italic text-sm">
                          No pricing set for this class. Click the button above to add fees.
                        </div>
                      )}
                   </div>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generate Vouchers Modal */}
      <Modal
        isOpen={voucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
        title="Generate Monthly Vouchers"
      >
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-xl flex gap-3">
             <AlertCircle className="text-blue-600 shrink-0" size={20} />
             <p className="text-xs text-blue-800 leading-relaxed">
               Generating vouchers will create a billing record for **every student** in the selected class based on the predefined fee structure.
             </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Select 
              label="Target Class"
              placeholder="Select Class"
              options={classes}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Billing Month" 
                type="number" 
                min="1" max="12"
                value={voucherData.month}
                onChange={(e) => setVoucherData({...voucherData, month: Number(e.target.value)})}
              />
              <Input 
                label="Billing Year" 
                type="number" 
                value={voucherData.year}
                onChange={(e) => setVoucherData({...voucherData, year: Number(e.target.value)})}
              />
            </div>

            <Input 
              label="Voucher Due Date" 
              type="date"
              value={voucherData.dueDate}
              onChange={(e) => setVoucherData({...voucherData, dueDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setVoucherModalOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateVouchers} loading={loading}>Start Generation</Button>
          </div>
        </div>
      </Modal>

      {/* Fee Type Modal */}
      <Modal
        isOpen={feeTypeModalOpen}
        onClose={() => {
          setFeeTypeModalOpen(false);
          setIsEditingFeeType(false);
          setNewFeeType({ name: '', isMonthly: true });
        }}
        title={isEditingFeeType ? "Edit Fee Category" : "Add Fee Category"}
      >
        <div className="space-y-6">
           <Input 
             label="Category Name" 
             placeholder="e.g. Tuition Fee"
             value={newFeeType.name}
             onChange={(e) => setNewFeeType({...newFeeType, name: e.target.value})}
           />
           
           <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase ml-1">Billing Frequency</label>
             <div 
               onClick={() => setNewFeeType({...newFeeType, isMonthly: !newFeeType.isMonthly})}
               className={`
                 flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                 ${newFeeType.isMonthly ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50'}
               `}
             >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Monthly Recurring</p>
                  <p className="text-xs text-slate-500">Enable this for Tuition, Bus or any fee charged every month.</p>
                </div>
                <div className={`
                  w-12 h-6 rounded-full relative transition-colors duration-200
                  ${newFeeType.isMonthly ? 'bg-primary' : 'bg-slate-300'}
                `}>
                  <div className={`
                    absolute top-1 bg-white w-4 h-4 rounded-full transition-all duration-200
                    ${newFeeType.isMonthly ? 'left-7' : 'left-1'}
                  `} />
                </div>
             </div>
           </div>

           <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setFeeTypeModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFeeType}>{isEditingFeeType ? 'Update Category' : 'Save Category'}</Button>
           </div>
        </div>
      </Modal>

      {/* Fee Structure Modal */}
      <Modal
        isOpen={feeStructureModalOpen}
        onClose={() => setFeeStructureModalOpen(false)}
        title={`Set Fee for ${selectedClass}`}
      >
        <div className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fee Category</label>
              <select
                value={editingStructure.feeTypeId}
                onChange={(e) => setEditingStructure({...editingStructure, feeTypeId: e.target.value})}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category...</option>
                {feeTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
           </div>
           <Input 
             label="Amount ($)" 
             type="number"
             placeholder="e.g. 500"
             value={editingStructure.amount}
             onChange={(e) => setEditingStructure({...editingStructure, amount: e.target.value})}
           />
           <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setFeeStructureModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateStructure}>Apply Pricing</Button>
           </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={deleteVoucherModalOpen}
        onClose={() => setDeleteVoucherModalOpen(false)}
        onConfirm={handleDeleteVoucher}
        title="Delete Fee Voucher"
        message="Are you sure you want to delete this voucher? This will remove the student's bill for this month."
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </div>
  );
}
