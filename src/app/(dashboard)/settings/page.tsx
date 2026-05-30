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
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon,
  Database,
  Download as DownloadIcon,
  Cloud as CloudIcon,
  Zap,
  FileUp,
  Info
} from 'lucide-react';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchSchoolProfile, 
  updateSchoolProfileThunk, 
  uploadSchoolLogoThunk,
  fetchSystemSettings, 
  updateSystemSettingsThunk,
  fetchUsers,
  updateUserThunk,
  deleteUserThunk,
  triggerEndOfDayThunk,
  triggerBackupThunk,
  fetchGradeScales,
  createGradeScaleThunk,
  updateGradeScaleThunk,
  deleteGradeScaleThunk,
  selectSchoolProfile,
  selectSystemSettings,
  selectUsers,
  selectGradeScales
} from '@/lib/features/settingsSlice';
import { 
  selectClasses, 
  selectSubjects, 
  selectExamTypes, 
  fetchConfig,
  addClassThunk,
  addSubjectThunk,
  addExamTypeThunk,
  updateExamTypeThunk,
  deleteClassThunk,
  deleteSubjectThunk,
  deleteExamTypeThunk
} from '@/lib/features/configSlice';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { User } from '@/types/models';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolProfileSchema, SchoolProfileFormData } from '@/lib/validations';
import BackupManager from '@/components/settings/BackupManager';
import { CSVImporter } from '@/components/ui/CSVImporter';
import { selectRole } from '@/lib/features/authSlice';

type TabId = 'profile' | 'academic' | 'grading' | 'users' | 'theme' | 'notifications' | 'security' | 'database';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectRole);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [testWhatsAppPhone, setTestWhatsAppPhone] = useState('');

  // ... rest of component
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const systemSettings = useAppSelector(selectSystemSettings);
  const users = useAppSelector(selectUsers);
  const gradeScales = useAppSelector(selectGradeScales);
  const classes = useAppSelector(selectClasses);
  const subjects = useAppSelector(selectSubjects);
  const examTypes = useAppSelector(selectExamTypes);

  // Grade Scale State
  const [isGradeScaleModalOpen, setIsGradeScaleModalOpen] = useState(false);
  const [isEditingScale, setIsEditingScale] = useState(false);
  const [selectedScale, setSelectedScale] = useState<any>(null);
  const [scaleFormData, setScaleFormData] = useState({
    grade: '',
    minScore: '',
    maxScore: '',
    points: ''
  });

  // Forms
// ... existing code ...
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    watch,
    formState: { errors: profileErrors },
  } = useForm<SchoolProfileFormData>({
    resolver: zodResolver(schoolProfileSchema),
  });

  const [settingsData, setSettingsData] = useState<Record<string, string>>({});
  const [isTriggering, setIsTriggering] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const resultAction = await dispatch(uploadSchoolLogoThunk(file));
      if (uploadSchoolLogoThunk.fulfilled.match(resultAction)) {
        const logoUrl = resultAction.payload as string;
        // Update the form field
        resetProfile({ ...schoolProfile as any, logo: logoUrl });
        toast.success('Logo uploaded successfully. Save the profile to apply changes.');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (err) {
      toast.error('Error uploading logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Modal States
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    destructive: false,
    onConfirm: () => {}
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [academicModal, setAcademicModal] = useState<{ 
    isOpen: boolean; 
    type: 'class' | 'subject' | 'examType'; 
    value: string;
    baseMark?: number;
    weightage?: number;
    isFinal?: boolean;
    category?: 'TUTORIAL' | 'FINAL';
    termNumber?: number;
    isEditing?: boolean;
  }>({
    isOpen: false,
    type: 'class',
    value: '',
    baseMark: 100,
    weightage: 100,
    isFinal: false,
    category: 'FINAL',
    termNumber: 1
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
      resetProfile({
        name: schoolProfile.name || '',
        address: schoolProfile.address || '',
        phone: schoolProfile.phone || '',
        email: schoolProfile.email || '',
        academicYear: schoolProfile.academicYear || '',
        website: schoolProfile.website || '',
        logo: schoolProfile.logo || ''
      });
    }
  }, [schoolProfile, resetProfile]);

  // Sync settings data
  useEffect(() => {
    if (systemSettings) {
      setSettingsData(systemSettings);
    }
  }, [systemSettings]);

  const onProfileSave = (data: SchoolProfileFormData) => {
    dispatch(updateSchoolProfileThunk(data))
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

  const handleResetTheme = () => {
    setSettingsData(prev => ({
      ...prev,
      theme: 'light',
      compactMode: 'false',
      accentColor: '#2563eb'
    }));
    toast.success('Theme preferences reset to defaults. Click Save to apply.');
  };

  const handleTriggerEndOfDay = () => {
    setIsTriggering(true);
    dispatch(triggerEndOfDayThunk())
      .unwrap()
      .then((msg) => toast.success(msg || 'End of day tasks completed'))
      .catch((err) => toast.error(err || 'Failed to run tasks'))
      .finally(() => setIsTriggering(false));
  };

  const handleTriggerBackup = () => {
    setIsTriggering(true);
    dispatch(triggerBackupThunk())
      .unwrap()
      .then((data: any) => {
        toast.success(`Backup successful: ${data.filename}`);
      })
      .catch((err) => toast.error(err || 'Backup failed'))
      .finally(() => setIsTriggering(false));
  };

  const handleTestWhatsApp = async () => {
    if (!testWhatsAppPhone) {
      toast.error('Enter a phone number to test');
      return;
    }
    setIsTriggering(true);
    try {
      await api.post('/settings/whatsapp-test', { phone: testWhatsAppPhone });
      toast.success('Test WhatsApp message sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send test message');
    } finally {
      setIsTriggering(false);
    }
  };

  // User Handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        dispatch(deleteUserThunk(userId))
          .unwrap()
          .then(() => {
            toast.success('User deleted successfully');
            dispatch(fetchUsers());
          })
          .catch((err) => toast.error(err || 'Failed to delete user'));
      }
    });
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

  // Grade Scale Handlers
  useEffect(() => {
    if (activeTab === 'grading') {
      dispatch(fetchGradeScales());
    }
  }, [activeTab, dispatch]);

  const handleAddGradeScale = () => {
    setIsEditingScale(false);
    setScaleFormData({ grade: '', minScore: '', maxScore: '', points: '' });
    setIsGradeScaleModalOpen(true);
  };

  const handleEditGradeScale = (scale: any) => {
    setIsEditingScale(true);
    setSelectedScale(scale);
    setScaleFormData({
      grade: scale.grade,
      minScore: scale.minScore.toString(),
      maxScore: scale.maxScore.toString(),
      points: scale.points.toString()
    });
    setIsGradeScaleModalOpen(true);
  };

  const handleDeleteGradeScale = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Grade Scale',
      message: 'Are you sure you want to delete this grade scale entry?',
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        dispatch(deleteGradeScaleThunk(id))
          .unwrap()
          .then(() => {
             toast.success('Grade scale deleted');
             dispatch(fetchGradeScales());
             setConfirmModal(prev => ({ ...prev, isOpen: false }));
          })
          .catch(err => toast.error(err));
      }
    });
  };

  const handleGradeScaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      grade: scaleFormData.grade,
      minScore: parseFloat(scaleFormData.minScore),
      maxScore: parseFloat(scaleFormData.maxScore),
      points: parseFloat(scaleFormData.points)
    };

    if (isEditingScale && selectedScale) {
      dispatch(updateGradeScaleThunk({ id: selectedScale.id, ...data }))
        .unwrap()
        .then(() => {
          toast.success('Grade scale updated');
          setIsGradeScaleModalOpen(false);
        })
        .catch(err => toast.error(err));
    } else {
      dispatch(createGradeScaleThunk(data))
        .unwrap()
        .then(() => {
          toast.success('Grade scale created');
          setIsGradeScaleModalOpen(false);
        })
        .catch(err => toast.error(err));
    }
  };

  const handleDeleteAcademic = (type: 'class' | 'subject' | 'examType', name: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${type}`,
      message: `Are you sure you want to delete this ${type}? This will remove all associated data.`,
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        let thunk: any;
        if (type === 'class') thunk = deleteClassThunk;
        else if (type === 'subject') thunk = deleteSubjectThunk;
        else thunk = deleteExamTypeThunk;

        dispatch(thunk(name))
          .unwrap()
          .then(() => {
            toast.success(`${type} deleted successfully`);
            dispatch(fetchConfig());
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          })
          .catch((err: any) => toast.error(err || `Failed to delete ${type}`));
      }
    });
  };

  // Academic Handlers
  const handleAddAcademic = (type: 'class' | 'subject' | 'examType') => {
    setAcademicModal({ 
      isOpen: true, 
      type, 
      value: '', 
      baseMark: 100, 
      weightage: 100, 
      isFinal: false, 
      category: 'FINAL', 
      termNumber: 1, 
      isEditing: false 
    });
  };

  const handleEditExamType = (exam: any) => {
    setAcademicModal({ 
      isOpen: true, 
      type: 'examType', 
      value: exam.label, 
      baseMark: exam.baseMark,
      weightage: exam.weightage || 100,
      isFinal: exam.isFinal || false,
      category: exam.category || 'FINAL',
      termNumber: exam.termNumber || 1,
      isEditing: true 
    });
  };

  const submitAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    const { type, value, baseMark, weightage, isFinal, category, termNumber, isEditing } = academicModal;
    if (!value.trim()) return;

    let thunk: any;
    let payload: any = value;

    if (type === 'class') thunk = addClassThunk;
    else if (type === 'subject') thunk = addSubjectThunk;
    else {
      if (isEditing) {
        thunk = updateExamTypeThunk;
        payload = { 
          name: value, 
          baseMark: baseMark || 100,
          weightage: weightage || 100,
          isFinal: isFinal || false,
          category: category || 'FINAL',
          termNumber: termNumber || 1
        };
      } else {
        thunk = addExamTypeThunk;
        payload = { 
          name: value, 
          baseMark: baseMark || 100,
          weightage: weightage || 100,
          isFinal: isFinal || false,
          category: category || 'FINAL',
          termNumber: termNumber || 1
        };
      }
    }

    dispatch(thunk(payload))
      .unwrap()
      .then(() => {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${isEditing ? 'updated' : 'added'} successfully`);
        setAcademicModal({ ...academicModal, isOpen: false, value: '' });
        dispatch(fetchConfig());
      })
      .catch((err: any) => toast.error(err || `Failed to ${isEditing ? 'update' : 'add'} ${type}`));
  };

  const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'School Profile', icon: Building2 },
    { id: 'academic', label: 'Academic Settings', icon: GraduationCap },
    { id: 'grading', label: 'Grade Scale', icon: ShieldCheck },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'theme', label: 'Theme & UI', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'database', label: 'Database & Backup', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">System Settings</h1>
        <p className="text-muted-foreground font-medium mt-1">Configure global platform preferences and organization profiles.</p>
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
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/50 pb-6">
                <CardTitle className="text-xl">School Profile</CardTitle>
                <CardDescription>Manage the primary identity and contact details of your institution.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitProfile(onProfileSave)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Institution Name"
                      placeholder="e.g. EduTrack Academy"
                      {...registerProfile('name')}
                      error={profileErrors.name?.message}
                    />
                    <Input 
                      label="Academic Year"
                      placeholder="e.g. 2026-2027"
                      {...registerProfile('academicYear')}
                      error={profileErrors.academicYear?.message}
                    />
                    <Input 
                      label="Contact Email"
                      type="email"
                      placeholder="admin@school.com"
                      {...registerProfile('email')}
                      error={profileErrors.email?.message}
                    />
                    <Input 
                      label="Contact Phone"
                      placeholder="+1 (555) 000-0000"
                      {...registerProfile('phone')}
                      error={profileErrors.phone?.message}
                    />
                    <Input 
                      label="Website URL"
                      placeholder="https://www.school.com"
                      {...registerProfile('website')}
                      error={profileErrors.website?.message}
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-0.5">School Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {watch('logo') ? (
                            <img src={watch('logo')} alt="School Logo" className="h-full w-full object-contain" />
                          ) : (
                            <ImageIcon size={24} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className={`
                            flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white 
                            text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors
                            ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}
                          `}>
                            {isUploadingLogo ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Upload size={16} />
                            )}
                            {isUploadingLogo ? 'Uploading...' : 'Upload New Logo'}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleLogoUpload}
                              disabled={isUploadingLogo}
                            />
                          </label>
                          <p className="text-[10px] text-slate-500 mt-1 font-medium">PNG, JPG or SVG (Max 2MB)</p>
                        </div>
                      </div>
                      <input type="hidden" {...registerProfile('logo')} />
                    </div>

                    <div className="md:col-span-2">
                      <Input 
                        label="Physical Address"
                        placeholder="123 Education Blvd, Knowledge City"
                        {...registerProfile('address')}
                        error={profileErrors.address?.message}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-border">
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
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/50 pb-6">
                  <CardTitle className="text-xl font-black">Academic Structure</CardTitle>
                  <CardDescription>Define how the academic year is divided.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-xl">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Terms per Year</h4>
                      <p className="text-muted-foreground text-xs mt-1">Select 2 (Bi-annual) or 3 (Trimester) terms.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button 
                        onClick={() => handleSettingChange('academicStructure', '2_TERMS')}
                        className={`px-6 py-2 rounded-md text-xs font-black transition-all ${settingsData.academicStructure === '2_TERMS' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                      >
                        2 TERMS
                      </button>
                      <button 
                        onClick={() => handleSettingChange('academicStructure', '3_TERMS')}
                        className={`px-6 py-2 rounded-md text-xs font-black transition-all ${settingsData.academicStructure === '3_TERMS' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
                      >
                        3 TERMS
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-start">
                    <Button onClick={handleSettingsSave} size="sm" className="gap-2">
                       <Save size={14} /> Save Structure
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Configured Classes</CardTitle>
                      <CardDescription>Active grades and class levels</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => handleAddAcademic('class')}><Plus size={16} className="mr-1"/> Add Class</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {classes.map(c => (
                      <div key={c.value} className="group relative flex items-center">
                        <span className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 font-bold border border-blue-100 dark:border-blue-800 pr-10">
                          {c.label}
                        </span>
                        <button 
                          onClick={() => handleDeleteAcademic('class', c.value)}
                          className="absolute right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Academic Subjects</CardTitle>
                      <CardDescription>Curriculum subjects taught across classes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => handleAddAcademic('subject')}><Plus size={16} className="mr-1"/> Add Subject</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {subjects.map(s => (
                      <div key={s.value} className="group relative flex items-center">
                        <span className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 font-bold border border-emerald-100 dark:border-emerald-800 pr-10">
                          {s.label}
                        </span>
                        <button 
                          onClick={() => handleDeleteAcademic('subject', s.value)}
                          className="absolute right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Assessment Types</CardTitle>
                      <CardDescription>Standardized exam definitions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => handleAddAcademic('examType')}><Plus size={16} className="mr-1"/> Add Exam Type</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    {examTypes.map(e => (
                      <div key={e.value} className="flex items-center gap-2 group">
                        <div className="flex flex-col px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 font-bold border border-purple-100 dark:border-purple-800">
                          <span className="text-sm">{e.label}</span>
                          <span className="text-[10px] opacity-60 uppercase tracking-tighter font-black">Weight: {e.weightage}%</span>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditExamType(e)}
                            className="p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAcademic('examType', e.value)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <Card className="border-border shadow-sm overflow-hidden p-0">
              <CardHeader className="border-b border-border bg-muted/50 p-6 flex flex-row justify-between items-center mb-0">
                <div>
                  <CardTitle className="text-xl">Platform Users</CardTitle>
                  <CardDescription>Manage administrators and teachers.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                    <FileUp size={16} className="mr-2" /> Import Staff
                  </Button>
                  <Button><Plus size={16} className="mr-2" /> Invite User</Button>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Name</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Email</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Role</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Joined</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-foreground">{u.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest ${
                            u.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt || '').toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditUser(u)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">No users found.</td>
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
                        <h4 className="font-bold text-foreground text-sm">Theme Mode</h4>
                        <p className="text-muted-foreground text-xs mt-1">Select the primary color scheme.</p>
                      </div>
                      <select 
                        value={settingsData.theme || 'light'} 
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="h-10 px-4 rounded-lg border border-border bg-card text-foreground font-semibold text-sm outline-none transition-standard focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="light" className="bg-card text-foreground">Light</option>
                        <option value="dark" className="bg-card text-foreground">Dark</option>
                        <option value="system" className="bg-card text-foreground">System Default</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Compact Mode</h4>
                        <p className="text-muted-foreground text-xs mt-1">Reduce spacing in tables and lists for denser data viewing.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.compactMode === 'true'} 
                          onChange={(e) => handleSettingChange('compactMode', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Brand Accent Color</h4>
                        <p className="text-muted-foreground text-xs mt-1">Used for primary buttons and highlights.</p>
                      </div>
                      <input 
                        type="color" 
                        value={settingsData.accentColor || '#2563eb'}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        className="h-10 w-14 rounded cursor-pointer border border-border bg-card" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-start gap-4 pt-6 border-t border-slate-100">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Save Preferences
                    </Button>
                    <Button type="button" variant="outline" onClick={handleResetTheme}>
                      Reset to Defaults
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/50 pb-6">
                <CardTitle className="text-xl">Notification Rules</CardTitle>
                <CardDescription>Manage automated alerts and system emails.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  <div className="space-y-6 max-w-xl">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Daily Attendance Alerts</h4>
                        <p className="text-muted-foreground text-xs mt-1">Send summary emails to class teachers daily.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.attendanceAlerts === 'true'} 
                          onChange={(e) => handleSettingChange('attendanceAlerts', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Exam Mark Finalization</h4>
                        <p className="text-muted-foreground text-xs mt-1">Alert admins when subject marks are locked.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.marksAlerts === 'true'} 
                          onChange={(e) => handleSettingChange('marksAlerts', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Fee Billing Notifications</h4>
                        <p className="text-muted-foreground text-xs mt-1">Notify parents when vouchers are issued or payments confirmed.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.feeNotifications === 'true'} 
                          onChange={(e) => handleSettingChange('feeNotifications', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Parent Notifications</h4>
                        <p className="text-muted-foreground text-xs mt-1">Enable automated SMS/Email for parents (Requires API Gateway).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settingsData.parentNotifications === 'true'} 
                          onChange={(e) => handleSettingChange('parentNotifications', e.target.checked ? 'true' : 'false')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* WhatsApp Configuration */}
                    <div className="pt-8 border-t border-border space-y-6">
                       <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                             <Zap size={18} />
                          </div>
                          <div>
                             <h4 className="font-bold text-foreground text-sm">WhatsApp Integration (Twilio)</h4>
                             <p className="text-muted-foreground text-xs mt-1">Configure your Twilio WhatsApp API for automated parent alerts.</p>
                          </div>
                       </div>

                       <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Twilio Account SID</label>
                                <Input 
                                   value={settingsData.twilioSid || ''} 
                                   onChange={(e) => handleSettingChange('twilioSid', e.target.value)} 
                                   placeholder="ACxxxxxxxxxxxxxxxx" 
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Twilio Auth Token</label>
                                <Input 
                                   type="password"
                                   value={settingsData.twilioToken || ''} 
                                   onChange={(e) => handleSettingChange('twilioToken', e.target.value)} 
                                   placeholder="••••••••••••••••" 
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Twilio WhatsApp Number</label>
                                <Input 
                                   value={settingsData.twilioNumber || ''} 
                                   onChange={(e) => handleSettingChange('twilioNumber', e.target.value)} 
                                   placeholder="whatsapp:+14155238886" 
                                />
                             </div>
                             <div className="flex flex-col justify-end">
                                <div className="flex items-center justify-between h-10 px-2">
                                   <span className="text-xs font-bold text-slate-700">Attendance via WhatsApp</span>
                                   <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                         type="checkbox" 
                                         checked={settingsData.parentNotificationsWhatsApp === 'true'} 
                                         onChange={(e) => handleSettingChange('parentNotificationsWhatsApp', e.target.checked ? 'true' : 'false')}
                                         className="sr-only peer" 
                                      />
                                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                   </label>
                                </div>
                                <div className="flex items-center justify-between h-10 px-2 border-t border-slate-200/50 mt-1">
                                   <span className="text-xs font-bold text-slate-700">Fee Alerts via WhatsApp</span>
                                   <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                         type="checkbox" 
                                         checked={settingsData.feeNotificationsWhatsApp === 'true'} 
                                         onChange={(e) => handleSettingChange('feeNotificationsWhatsApp', e.target.checked ? 'true' : 'false')}
                                         className="sr-only peer" 
                                      />
                                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                   </label>
                                </div>
                             </div>
                          </div>

                          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3 items-end">
                             <div className="flex-1 w-full">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Test WhatsApp Message</label>
                                <Input 
                                   value={testWhatsAppPhone} 
                                   onChange={(e) => setTestWhatsAppPhone(e.target.value)} 
                                   placeholder="Enter phone with country code (e.g. +88017...)" 
                                />
                             </div>
                             <Button 
                                type="button" 
                                variant="soft" 
                                onClick={handleTestWhatsApp}
                                disabled={isTriggering}
                                className="min-w-[140px]"
                             >
                                {isTriggering ? <Loader2 size={16} className="animate-spin mr-2" /> : <Zap size={16} className="mr-2" />}
                                Send Test
                             </Button>
                          </div>
                       </div>
                    </div>

                  </div>
                  <div className="flex justify-start gap-4 pt-6 border-t border-border">
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
            <Card className="border-border shadow-sm border-t-red-500 border-t-4">
              <CardHeader className="border-b border-border bg-muted/50 pb-6">
                <CardTitle className="text-xl">Security & Authentication</CardTitle>
                <CardDescription>Manage sessions and account security protocols.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-8">
                  <div className="max-w-xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80">JWT Session Timeout (Minutes)</label>
                      <Input 
                        type="number"
                        value={settingsData.sessionTimeout || '60'} 
                        onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)} 
                        placeholder="e.g. 60" 
                      />
                      <p className="text-xs text-muted-foreground font-medium">Users will be forcibly logged out after this period of inactivity.</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border max-w-xl">
                    <h3 className="text-sm font-bold text-foreground mb-4">Account Security</h3>
                    <Button type="button" variant="outline" className="text-foreground font-bold w-full md:w-auto">
                      Initiate Password Reset
                    </Button>
                    <p className="text-xs text-muted-foreground font-medium mt-3">A secure link will be emailed to your registered admin address.</p>
                  </div>

                  <div className="flex justify-start pt-6 border-t border-border">
                    <Button type="submit" className="px-8 shadow-lg shadow-blue-200">
                      <Save size={18} className="mr-2" /> Update Security Policies
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* GRADING TAB */}
          {activeTab === 'grading' && (
            <Card className="border-border shadow-sm overflow-hidden p-0">
              <CardHeader className="border-b border-border bg-muted/50 p-6 flex flex-row justify-between items-center mb-0">
                <div>
                  <CardTitle className="text-xl">Grade Scale Definitions</CardTitle>
                  <CardDescription>Map percentage ranges to letter grades and GPAs.</CardDescription>
                </div>
                <Button onClick={handleAddGradeScale}><Plus size={16} className="mr-2" /> Add Rule</Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Letter Grade</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Min Score (%)</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">Max Score (%)</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs">GP Points</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {gradeScales?.map(scale => (
                      <tr key={scale.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-md bg-primary/10 text-primary font-black text-sm">
                            {scale.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{scale.minScore}%</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{scale.maxScore}%</td>
                        <td className="px-6 py-4">
                          <span className="font-black text-emerald-600">{scale.points.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditGradeScale(scale)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteGradeScale(scale.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(gradeScales || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                          No custom grade scales defined. Using system defaults (80%=A, 70%=B, etc.)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* DATABASE TAB */}
          {activeTab === 'database' && (
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border pb-6">
                <CardTitle className="text-xl">Database & Data Safeguard</CardTitle>
                <CardDescription>Configure automated backups and manage institutional data integrity.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div className="max-w-xl space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-4">
                       <ShieldCheck className="text-amber-600 shrink-0" size={24} />
                       <div>
                          <p className="text-sm font-bold text-amber-900">Data Protection</p>
                          <p className="text-xs text-amber-800 mt-0.5">Automated backups are scheduled to run daily at 2:00 AM. Ensure your backup path is accessible.</p>
                       </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <label className="text-sm font-bold text-foreground/80">Local Backup Path</label>
                      <div className="flex gap-2">
                        <Input 
                          value={settingsData.backupPath || ''} 
                          onChange={(e) => handleSettingChange('backupPath', e.target.value)} 
                          placeholder="e.g. C:\EduTracker\Backups or E:\" 
                        />
                        <Button onClick={handleSettingsSave} variant="outline" className="shrink-0">
                           <Save size={16} />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium italic">If left empty, backups will be stored in the application's root 'backups' folder.</p>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                         <div>
                            <h4 className="font-bold text-foreground text-sm">Manual Database Dump</h4>
                            <p className="text-muted-foreground text-xs mt-1">Trigger an immediate full SQL backup of the system.</p>
                         </div>
                         <Button onClick={handleTriggerBackup} disabled={isTriggering} className="gap-2 shadow-lg shadow-blue-200 min-w-[160px]">
                            {isTriggering ? <Loader2 size={16} className="animate-spin" /> : <DownloadIcon size={16} />}
                            {isTriggering ? 'Backing up...' : 'Backup Now'}
                         </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                       <BackupManager />
                    </div>

                    <div className="pt-8 border-t border-border space-y-6">
                       <div>
                          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                             <CloudIcon size={18} className="text-blue-500" />
                             Cloud Backup (Google Drive)
                          </h4>
                          <p className="text-muted-foreground text-xs mt-1">Automatically sync your daily backups to Google Drive for off-site protection.</p>
                       </div>

                       <div className="space-y-4 max-w-xl">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-foreground/80">Enable Cloud Sync</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={settingsData.googleDriveEnabled === 'true'} 
                                onChange={(e) => handleSettingChange('googleDriveEnabled', e.target.checked ? 'true' : 'false')}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground/80">Google Drive Folder ID</label>
                            <Input 
                              value={settingsData.googleDriveFolderId || ''} 
                              onChange={(e) => handleSettingChange('googleDriveFolderId', e.target.value)} 
                              placeholder="Paste the Folder ID from the Drive URL" 
                            />
                            <p className="text-[10px] text-muted-foreground italic">Share the folder with your service account email as an Editor.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground/80">Service Account Credentials (JSON)</label>
                            <textarea
                              value={settingsData.googleDriveCredentials || ''}
                              onChange={(e) => handleSettingChange('googleDriveCredentials', e.target.value)}
                              placeholder="Paste the contents of your credentials.json file here"
                              className="w-full h-32 p-3 text-xs font-mono rounded-lg border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                          </div>

                          <div className="flex justify-start">
                             <Button onClick={handleSettingsSave} className="shadow-lg shadow-blue-200">
                                <Save size={16} className="mr-2" /> Save Cloud Configuration
                             </Button>
                          </div>
                          
                          {settingsData.lastCloudBackupRun && (
                            <p className="text-[10px] text-muted-foreground font-medium italic">
                               Last successful cloud sync: <span className="font-bold text-foreground">{new Date(settingsData.lastCloudBackupRun).toLocaleString()}</span>
                            </p>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Grade Scale Modal */}
      <Modal
        isOpen={isGradeScaleModalOpen}
        onClose={() => setIsGradeScaleModalOpen(false)}
        title={isEditingScale ? 'Edit Grading Rule' : 'New Grading Rule'}
      >
        <form onSubmit={handleGradeScaleSubmit} className="space-y-4">
          <Input 
            label="Letter Grade (e.g. A+)"
            value={scaleFormData.grade}
            onChange={(e) => setScaleFormData(prev => ({ ...prev, grade: e.target.value }))}
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Min Score %"
              type="number"
              step="0.01"
              value={scaleFormData.minScore}
              onChange={(e) => setScaleFormData(prev => ({ ...prev, minScore: e.target.value }))}
              required
            />
            <Input 
              label="Max Score %"
              type="number"
              step="0.01"
              value={scaleFormData.maxScore}
              onChange={(e) => setScaleFormData(prev => ({ ...prev, maxScore: e.target.value }))}
              required
            />
          </div>
          <Input 
            label="Grade Points (e.g. 4.00)"
            type="number"
            step="0.01"
            value={scaleFormData.points}
            onChange={(e) => setScaleFormData(prev => ({ ...prev, points: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsGradeScaleModalOpen(false)}>Cancel</Button>
            <Button type="submit">{isEditingScale ? 'Update Rule' : 'Create Rule'}</Button>
          </div>
        </form>
      </Modal>

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
              <option value="PRINCIPAL">Principal</option>
              <option value="TEACHER">Teacher</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="STAFF">General Staff</option>
              <option value="CLERK">Clerk</option>
              <option value="SECURITY">Security</option>
              <option value="CLEANER">Cleaner</option>
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
        title={academicModal.isEditing ? `Edit ${academicModal.type.charAt(0).toUpperCase() + academicModal.type.slice(1)}` : `Add New ${academicModal.type.charAt(0).toUpperCase() + academicModal.type.slice(1)}`}
      >
        <form onSubmit={submitAcademic} className="space-y-4">
          <Input 
            label="Name"
            placeholder={`e.g. ${academicModal.type === 'class' ? 'Class 11' : academicModal.type === 'subject' ? 'Physics' : 'Mid Term'}`}
            value={academicModal.value}
            onChange={(e) => setAcademicModal({ ...academicModal, value: e.target.value })}
            disabled={academicModal.isEditing}
            autoFocus
          />
          {academicModal.type === 'examType' && (
            <div className="space-y-4">
              <Input 
                label="Base Mark (Maximum Score)"
                type="number"
                placeholder="e.g. 100"
                value={academicModal.baseMark ?? ''}
                onChange={(e) => setAcademicModal({ ...academicModal, baseMark: Number(e.target.value) })}
              />
              <Input 
                label="Weightage (%)"
                type="number"
                placeholder="e.g. 30"
                value={academicModal.weightage ?? ''}
                onChange={(e) => setAcademicModal({ ...academicModal, weightage: Number(e.target.value) })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Exam Category</label>
                  <select
                    value={academicModal.category}
                    onChange={(e) => setAcademicModal({ ...academicModal, category: e.target.value as any })}
                    className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="FINAL">Final/Term Exam</option>
                    <option value="TUTORIAL">Class Test / Tutorial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Term Number</label>
                  <select
                    value={academicModal.termNumber}
                    onChange={(e) => setAcademicModal({ ...academicModal, termNumber: Number(e.target.value) })}
                    className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={1}>Term 1</option>
                    <option value={2}>Term 2</option>
                    <option value={3}>Term 3</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h4 className="font-bold text-foreground text-sm">Is Final Exam?</h4>
                  <p className="text-muted-foreground text-[10px] mt-1">If true, this exam type will not be included in combined annual calculations.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={academicModal.isFinal === true} 
                    onChange={(e) => setAcademicModal({ ...academicModal, isFinal: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setAcademicModal({ ...academicModal, isOpen: false })}>Cancel</Button>
            <Button type="submit">{academicModal.isEditing ? 'Update' : 'Add'} {academicModal.type.charAt(0).toUpperCase() + academicModal.type.slice(1)}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal 
        {...confirmModal} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
      />

      {/* Import CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Bulk Import Staff Members"
        className="max-w-xl"
      >
        <CSVImporter 
          type="staff" 
          onSuccess={() => {
            dispatch(fetchUsers());
          }}
          onClose={() => setIsImportModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
