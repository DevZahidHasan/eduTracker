"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Trash2, 
  Edit,
  AlertCircle,
  Camera,
  CheckCircle2,
  X,
  CreditCard,
  Phone,
  MapPin,
  Lock,
  Unlock
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { 
  fetchUsers, 
  createUserThunk, 
  updateUserThunk, 
  deleteUserThunk,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError
} from '@/lib/features/usersSlice';
import { selectRole, selectUser, updateCurrentUser } from '@/lib/features/authSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { User, Role } from '@/types/models';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function StaffManagementPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const currentUserRole = useAppSelector(selectRole);
  const currentUser = useAppSelector(selectUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TEACHER' as Role,
    nid: '',
    phone: '',
    address: '',
    canLogin: true,
    profileImage: ''
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nid?.includes(searchTerm)
  );

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email,
        password: '',
        role: user.role,
        nid: user.nid || '',
        phone: user.phone || '',
        address: user.address || '',
        canLogin: user.canLogin,
        profileImage: user.profileImage || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'TEACHER',
        nid: '',
        phone: '',
        address: '',
        canLogin: true,
        profileImage: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic: Teachers and Admins MUST have canLogin = true in this UI for consistency,
    // though the DB allows it. If it's a cleaner/security etc, we might default to false.
    const submissionData = { ...formData };
    if (!['ADMIN', 'TEACHER'].includes(formData.role)) {
       // Optional: you can force canLogin to false here if you want, 
       // but let's leave it to the user's choice in the checkbox.
    }

    try {
      if (editingUser) {
        const updatedUser = await dispatch(updateUserThunk({ ...editingUser, ...submissionData })).unwrap();
        
        // If the logged-in user is editing their own profile, update the auth state
        if (currentUser && currentUser.id === updatedUser.id) {
          dispatch(updateCurrentUser(updatedUser));
        }
        
        toast.success('Staff profile updated');
      } else {
        await dispatch(createUserThunk(submissionData)).unwrap();
        toast.success('Staff member added successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to save staff member');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteUserThunk(userToDelete.id)).unwrap();
      toast.success('Staff member removed');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      toast.error(err || 'Failed to remove staff member');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (currentUserRole !== 'ADMIN') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">Only administrators can access the staff management console.</p>
        <Button onClick={() => window.history.back()} className="min-h-[44px] w-full sm:w-auto">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <Shield size={12} />
            HR & Personnel Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Institutional Staff</h1>
          <p className="text-slate-500 font-medium">Comprehensive database of all academic and support personnel.</p>
        </div>
        
        <Button onClick={() => handleOpenModal()} size="lg" className="min-h-[44px] rounded-2xl shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest px-8 w-full sm:w-auto">
          <UserPlus size={18} className="mr-2" />
          Onboard New Staff
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/40 bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by name, email, or NID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-slate-50 border-none rounded-xl font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredUsers.length} Staff Members</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Personnel</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role & Access</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & NID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48 rounded-xl" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden relative">
                            {user.profileImage ? (
                              <Image src={user.profileImage} alt={user.name || ''} fill sizes="48px" className="object-cover" />
                            ) : (
                              user.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name || 'Unnamed User'}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            ['ADMIN', 'TEACHER'].includes(user.role) ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.role}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight">
                            {user.canLogin ? (
                              <><Unlock size={10} className="text-emerald-500" /> <span className="text-emerald-600">Login Enabled</span></>
                            ) : (
                              <><Lock size={10} className="text-slate-400" /> <span className="text-slate-400">No Login Access</span></>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <CreditCard size={12} className="text-slate-400" />
                            {user.nid || 'NID Not Set'}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Phone size={12} className="text-slate-400" />
                            {user.phone || 'No Phone'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenModal(user)}
                            className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border border-dashed border-slate-200">
                        <Users size={24} />
                      </div>
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No matching records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Onboard/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Update Personnel File' : 'Onboard New Staff'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSaveUser} className="space-y-6 pt-4">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Image Upload */}
            <div className="flex flex-col items-center gap-4">
               <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-32 w-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-all overflow-hidden relative group"
               >
                 {formData.profileImage ? (
                   <>
                    <Image src={formData.profileImage} alt="Preview" fill sizes="128px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Camera size={24} />
                    </div>
                   </>
                 ) : (
                   <>
                    <Camera size={24} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                   </>
                 )}
               </div>
               <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
               />
               <div className="text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile Picture</p>
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, profileImage: ''})}
                  className="text-[9px] font-bold text-red-400 uppercase tracking-tighter hover:text-red-600 mt-1"
                 >
                   Remove
                 </button>
               </div>
            </div>

            {/* Right: Primary Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Michael Chen"
                  className="h-11 min-h-[44px] rounded-xl border-slate-100 bg-slate-50/50 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                <Select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                  options={[
                    { value: 'TEACHER', label: 'Teacher' },
                    { value: 'ADMIN', label: 'Administrator' },
                    { value: 'LIBRARIAN', label: 'Librarian' },
                    { value: 'ACCOUNTANT', label: 'Accountant' },
                    { value: 'CLERK', label: 'Office Clerk' },
                    { value: 'SECURITY', label: 'Security Personnel' },
                    { value: 'CLEANER', label: 'Cleaning Staff' },
                    { value: 'STAFF', label: 'General Staff' }
                  ]}
                  className="h-11 min-h-[44px] rounded-xl border-slate-100 bg-slate-50/50 font-black text-[10px] uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NID Number</label>
                <Input 
                  value={formData.nid}
                  onChange={(e) => setFormData({...formData, nid: e.target.value})}
                  placeholder="13-digit NID"
                  className="h-11 min-h-[44px] rounded-xl border-slate-100 bg-slate-50/50 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-primary flex items-center gap-2">
                <Lock size={12} />
                Access Credentials
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Grant Login Access</span>
                  <input 
                    type="checkbox" 
                    checked={formData.canLogin}
                    onChange={(e) => setFormData({...formData, canLogin: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </div>
                
                <div className={`space-y-3 transition-all ${formData.canLogin ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <Input 
                    required={formData.canLogin}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Institutional Email"
                    className="h-10 min-h-[44px] rounded-xl border-slate-200 bg-white font-bold text-sm"
                  />
                  <Input 
                    required={formData.canLogin && !editingUser}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? "New Password (optional)" : "Secure Password"}
                    className="h-10 min-h-[44px] rounded-xl border-slate-200 bg-white font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={12} />
                Contact Particulars
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Primary Phone Number"
                  className="h-10 min-h-[44px] rounded-xl border-slate-200 bg-white font-bold text-sm"
                />
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Residential Address"
                  className="w-full h-20 p-3 rounded-xl border border-slate-200 bg-white font-bold text-sm focus:ring-1 focus:ring-primary focus:outline-none custom-scrollbar"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-xs">
              Discard Changes
            </Button>
            <Button type="submit" className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              {editingUser ? 'Sync File Changes' : 'Complete Onboarding'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Revoke All Privileges?"
      >
        <div className="pt-4 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle size={32} className="text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-800 leading-relaxed">
              This will permanently delete <span className="font-bold underline">{userToDelete?.name}</span> from the institutional database. This action is irreversible.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-500">
              Retain Record
            </Button>
            <Button onClick={handleDeleteUser} className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200">
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
