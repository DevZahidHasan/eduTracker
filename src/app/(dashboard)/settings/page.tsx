'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Palette, 
  Bell, 
  ShieldCheck, 
  Save,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchSchoolProfile, 
  updateSchoolProfileThunk, 
  fetchSystemSettings, 
  updateSystemSettingsThunk,
  fetchUsers,
  updateUserThunk,
  deleteUserThunk,
  triggerEndOfDayThunk,
  selectSchoolProfile,
  selectSystemSettings,
  selectUsers
} from '@/lib/features/settingsSlice';
import { 
  selectClasses, 
  selectSubjects, 
  selectExamTypes, 
  fetchConfig,
  addClassThunk,
  addSubjectThunk,
  addExamTypeThunk
} from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { User } from '@/types/models';
import toast from 'react-hot-toast';

type TabId = 'profile' | 'academic' | 'users' | 'theme' | 'notifications' | 'security';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  // Selectors
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const systemSettings = useAppSelector(selectSystemSettings);
  const users = useAppSelector(selectUsers);
  const classes = useAppSelector(selectClasses);
  const subjects = useAppSelector(selectSubjects);
  const examTypes = useAppSelector(selectExamTypes);

  // Local State for Forms
  const [profileData, setProfileData] = useState({
    name: '', address: '', phone: '', email: '', academicYear: ''
  });
  const [settingsData, setSettingsData] = useState<Record<string, string>>({});
  const [isTriggering, setIsTriggering] = useState(false);

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [academicModal, setAcademicModal] = useState<{ isOpen: boolean; type: 'class' | 'subject' | 'examType'; value: string }>({
    isOpen: false,
    type: 'class',
    value: ''
  });

  useEffect(() => {
    dispatch(fetchSchoolProfile());
    dispatch(fetchSystemSettings());
    dispatch(fetchUsers());
    dispatch(fetchConfig());
  }, [dispatch]);

  // Sync profile data
  useEffect(() => {
    if (schoolProfile) {
      setProfileData({
        name: schoolProfile.name || '',
        address: schoolProfile.address || '',
        phone: schoolProfile.phone || '',
        email: schoolProfile.email || '',
        academicYear: schoolProfile.academicYear || ''
      });
    }
  }, [schoolProfile]);

  // Sync settings data
  useEffect(() => {
    if (systemSettings) {
      setSettingsData(systemSettings);
    }
  }, [systemSettings]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSchoolProfileThunk(profileData))
      .unwrap()
      .then(() => toast.success('School profile updated successfully'))
      .catch((err) => toast.error(err || 'Failed to update profile'));
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSystemSettingsThunk(settingsData))
      .unwrap()
      .then(() => toast.success('Settings updated successfully'))
      .catch((err) => toast.error(err || 'Failed to update settings'));
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettingsData(prev => ({ ...prev, [key]: value }));
  };

  const handleTriggerEndOfDay = () => {
    setIsTriggering(true);
    dispatch(triggerEndOfDayThunk())
      .unwrap()
      .then((msg) => toast.success(msg || 'End of day tasks completed'))
      .catch((err) => toast.error(err || 'Failed to run tasks'))
      .finally(() => setIsTriggering(false));
  };

  // User Handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUserThunk(userId))
        .unwrap()
        .then(() => {
          toast.success('User deleted successfully');
          dispatch(fetchUsers());
        })
        .catch((err) => toast.error(err || 'Failed to delete user'));
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    dispatch(updateUserThunk(editingUser))
      .unwrap()
      .then(() => {
        toast.success('User updated successfully');
        setIsUserModalOpen(false);
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(err || 'Failed to update user'));
  };

  // Academic Handlers
  const handleAddAcademic = (type: 'class' | 'subject' | 'examType') => {
    setAcademicModal({ isOpen: true, type, value: '' });
  };

  const submitAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    const { type, value } = academicModal;
    if (!value.trim()) return;

    let thunk;
    if (type === 'class') thunk = addClassThunk;
    else if (type === 'subject') thunk = addSubjectThunk;
    else thunk = addExamTypeThunk;

    dispatch(thunk(value))
      .unwrap()
      .then(() => {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
        setAcademicModal({ ...academicModal, isOpen: false, value: '' });
        dispatch(fetchConfig());
      })
      .catch((err) => toast.error(err || `Failed to add ${type}`));
  };

  const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'School Profile', icon: Building2 },
    { id: 'academic', label: 'Academic Settings', icon: GraduationCap },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'theme', label: 'Theme & UI', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure global platform preferences and organization profiles.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <CardTitle className="text-xl">School Profile</CardTitle>
                <CardDescription>Manage the primary identity and contact details of your institution.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Institution Name</label>
                      <Input 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                        placeholder="e.g. EduTrack Academy" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Academic Year</label>
                      <Input 
                        value={profileData.academicYear} 
                        onChange={(e) => setProfileData({...profileData, academicYear: e.target.value})} 
                        placeholder="e.g. 2026-2027" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Contact Email</label>
                      <Input 
                        type="email"
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                        placeholder="admin@school.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Contact Phone</label>
                      <Input 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700">Physical Address</label>
                      <Input 
                        value={profileData.address} 
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                        placeholder="123 Education Blvd, Knowledge City" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ACADEMIC TAB */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Configured Classes</CardTitle>
                      <CardDescription>Active grades and class levels</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAddAcademic('class')}><Plus size={16} className="mr-1"/> Add Class</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {classes.map(c => (
                      <span key={c.value} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-100">
                        {c.label}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Academic Subjects</CardTitle>
                      <CardDescription>Curriculum subjects taught across classes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAddAcademic('subject')}><Plus size={16} className="mr-1"/> Add Subject</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {subjects.map(s => (
                      <span key={s.value} className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                        {s.label}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Assessment Types</CardTitle>
                      <CardDescription>Standardized exam definitions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAddAcademic('examType')}><Plus size={16} className="mr-1"/> Add Exam Type</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {examTypes.map(e => (
                      <span key={e.value} className="px-4 py-2 rounded-lg bg-purple-50 text-purple-700 font-bold border border-purple-100">
                        {e.label}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Platform Users</CardTitle>
                  <CardDescription>Manage administrators and teachers.</CardDescription>
                </div>
                <Button><Plus size={16} className="mr-2" /> Invite User</Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Name</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Email</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Role</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Joined</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-900">{u.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest ${
                            u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt || '').toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditUser(u)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* THEME & UI TAB */}
          {activeTab === 'theme' && (
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <CardTitle className="text-xl">Theme & UI Preferences</CardTitle>
                <CardDescription>Customize the look and feel of the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Theme Mode</h4>
                        <p className="text-slate-500 text-xs mt-1">Select the primary color scheme.</p>
                      </div>
                      <select 
                        value={settingsData.theme || 'light'} 
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-sm outline-none"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark (Coming Soon)</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Compact Mode</h4>
                        <p className="text-slate-500 text-xs mt-1">Reduce spacing in tables and lists for denser data viewing.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.compactMode === 'true'} 
                          onChange={(e) => handleSettingChange('compactMode', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Brand Accent Color</h4>
                        <p className="text-slate-500 text-xs mt-1">Used for primary buttons and highlights.</p>
                      </div>
                      <input 
                        type="color" 
                        value={settingsData.accentColor || '#2563eb'}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        className="h-10 w-14 rounded cursor-pointer border border-slate-200" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-start pt-6 border-t border-slate-100">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Save Preferences
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <CardTitle className="text-xl">Notification Rules</CardTitle>
                <CardDescription>Manage automated alerts and system emails.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  <div className="space-y-6 max-w-xl">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Daily Attendance Alerts</h4>
                        <p className="text-slate-500 text-xs mt-1">Send summary emails to class teachers daily.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.attendanceAlerts === 'true'} 
                          onChange={(e) => handleSettingChange('attendanceAlerts', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Exam Mark Finalization</h4>
                        <p className="text-slate-500 text-xs mt-1">Alert admins when subject marks are locked.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.marksAlerts === 'true'} 
                          onChange={(e) => handleSettingChange('marksAlerts', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Parent Notifications</h4>
                        <p className="text-slate-500 text-xs mt-1">Enable automated SMS/Email for parents (Requires API Gateway).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.parentNotifications === 'true'} 
                          onChange={(e) => handleSettingChange('parentNotifications', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                  </div>
                  <div className="flex justify-start gap-4 pt-6 border-t border-slate-100">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Save Notification Rules
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTriggerEndOfDay} disabled={isTriggering}>
                      {isTriggering ? 'Running...' : 'Run End-of-Day Tasks Now'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <Card className="border-slate-200/60 shadow-sm border-t-red-500 border-t-4">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <CardTitle className="text-xl">Security & Authentication</CardTitle>
                <CardDescription>Manage sessions and account security protocols.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-8">
                  <div className="max-w-xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">JWT Session Timeout (Minutes)</label>
                      <Input 
                        type="number"
                        value={settingsData.sessionTimeout || '60'} 
                        onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)} 
                        placeholder="e.g. 60" 
                      />
                      <p className="text-xs text-slate-500 font-medium">Users will be forcibly logged out after this period of inactivity.</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 max-w-xl">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Account Security</h3>
                    <Button type="button" variant="outline" className="text-slate-700 font-bold w-full md:w-auto">
                      Initiate Password Reset
                    </Button>
                    <p className="text-xs text-slate-500 font-medium mt-3">A secure link will be emailed to your registered admin address.</p>
                  </div>

                  <div className="flex justify-start pt-6 border-t border-slate-100">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Update Security Policies
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Edit User Profile"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input 
            label="Full Name"
            value={editingUser?.name || ''}
            onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input 
            label="Email Address"
            type="email"
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Role</label>
            <select
              value={editingUser?.role || 'TEACHER'}
              onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value as any }))}
              className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
            <Button type="submit">Update User</Button>
          </div>
        </form>
      </Modal>

      {/* Academic Add Modal */}
      <Modal
        isOpen={academicModal.isOpen}
        onClose={() => setAcademicModal({ ...academicModal, isOpen: false })}
        title={`Add New ${academicModal.type.charAt(0).toUpperCase() + academicModal.type.slice(1)}`}
      >
        <form onSubmit={submitAcademic} className="space-y-4">
          <Input 
            label="Name"
            placeholder={`e.g. ${academicModal.type === 'class' ? 'Class 11' : academicModal.type === 'subject' ? 'Physics' : 'Mid Term'}`}
            value={academicModal.value}
            onChange={(e) => setAcademicModal({ ...academicModal, value: e.target.value })}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setAcademicModal({ ...academicModal, isOpen: false })}>Cancel</Button>
            <Button type="submit">Add {academicModal.type.charAt(0).toUpperCase() + academicModal.type.slice(1)}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
