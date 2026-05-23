'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { 
  Contact, 
  Download, 
  Printer, 
  Settings2, 
  UserCheck, 
  Users, 
  CheckSquare, 
  Square,
  Eye,
  Type,
  Palette,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Student } from '@/types/models';
import { Template } from '@/types/documents';
import { documentService } from '@/services/document.service';

export default function IDCardsPage() {
  const [activeTab, setActiveTab] = useState<'id-cards' | 'certificates'>('id-cards');
  const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
  const [sections, setSections] = useState<{ value: string; label: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>(undefined);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const [certSettings, setCertSettings] = useState({
    type: 'CHARACTER_CERTIFICATE' as any,
    date: new Date().toISOString().split('T')[0],
    issueNumber: `CERT-${new Date().getFullYear()}-001`
  });

  useEffect(() => {
    fetchConfig();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedSection]);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/config');
      setClasses(res.data.data.classes);
    } catch (err) {
      toast.error('Failed to fetch classes');
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await documentService.getTemplates();
      
      if (activeTab === 'id-cards') {
        const idTemplates = data.filter(t => t.type === 'ID_CARD');
        setTemplates(idTemplates);
        const defaultTemplate = idTemplates.find(t => t.isDefault) || idTemplates[0];
        if (defaultTemplate) {
          setSelectedTemplateId(defaultTemplate.id);
          setPreviewTemplate(defaultTemplate.config);
        } else {
          setPreviewTemplate({
            primaryColor: '#1e40af',
            secondaryColor: '#ffffff',
            textColor: '#1e293b',
            layout: 'portrait',
            showSchoolAddress: true,
            showSchoolPhone: true
          });
        }
      } else {
        const certTemplates = data.filter(t => t.type === certSettings.type);
        setTemplates(certTemplates);
        const defaultTemplate = certTemplates.find(t => t.isDefault) || certTemplates[0];
        if (defaultTemplate) {
          setSelectedTemplateId(defaultTemplate.id);
          setPreviewTemplate(defaultTemplate.config);
        } else {
          setPreviewTemplate({
            primaryColor: '#1e40af',
            borderStyle: 'double',
            titleFont: 'Georgia'
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [activeTab, certSettings.type]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students', {
        params: { className: selectedClass, section: selectedSection }
      });
      setStudents(res.data.data);
      setSelectedStudentIds([]); 
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (id: number) => {
    if (activeTab === 'certificates') {
      setSelectedStudentIds([id]); // For certificates, only select one at a time for now
    } else {
      setSelectedStudentIds(prev => 
        prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
      );
    }
  };

  const selectAll = () => {
    if (activeTab === 'id-cards') {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const clearSelection = () => {
    setSelectedStudentIds([]);
  };

  const handleGenerate = async () => {
    if (selectedStudentIds.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    setGenerating(true);
    try {
      let blob;
      let filename;

      if (activeTab === 'id-cards') {
        blob = await documentService.generateIDCards({
          studentIds: selectedStudentIds,
          templateId: selectedTemplateId
        });
        filename = `ID_Cards_${selectedClass}_${selectedSection}.pdf`;
      } else {
        blob = await documentService.generateCertificate({
          studentId: selectedStudentIds[0],
          templateId: selectedTemplateId,
          type: certSettings.type,
          date: certSettings.date,
          issueNumber: certSettings.issueNumber
        });
        filename = `${certSettings.type.toLowerCase()}_${selectedStudentIds[0]}.pdf`;
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document generated successfully!');
    } catch (err) {
      toast.error('Failed to generate document');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="text-muted-foreground">Generate ID cards and official certificates for students.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <Button 
          variant={activeTab === 'id-cards' ? 'primary' : 'ghost'} 
          onClick={() => { setActiveTab('id-cards'); setSelectedStudentIds([]); }}
        >
          <Contact className="w-4 h-4 mr-2" /> ID Cards
        </Button>
        <Button 
          variant={activeTab === 'certificates' ? 'primary' : 'ghost'} 
          onClick={() => { setActiveTab('certificates'); setSelectedStudentIds([]); }}
        >
          <FileText className="w-4 h-4 mr-2" /> Certificates
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> 
                {activeTab === 'id-cards' ? 'Card Settings' : 'Certificate Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === 'certificates' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Type</label>
                    <Select
                      options={[
                        { value: 'CHARACTER_CERTIFICATE', label: 'Character Certificate' },
                        { value: 'LEAVING_CERTIFICATE', label: 'Leaving Certificate' },
                      ]}
                      value={certSettings.type}
                      onChange={e => setCertSettings({...certSettings, type: e.target.value as any})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Issue Date</label>
                    <Input 
                      type="date" 
                      value={certSettings.date} 
                      onChange={e => setCertSettings({...certSettings, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Serial Number</label>
                    <Input 
                      value={certSettings.issueNumber} 
                      onChange={e => setCertSettings({...certSettings, issueNumber: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Template</label>
                <Select
                  options={templates.map(t => ({ value: t.id.toString(), label: t.name }))}
                  value={selectedTemplateId?.toString()}
                  onChange={e => {
                    const tId = parseInt(e.target.value);
                    setSelectedTemplateId(tId);
                    const t = templates.find(temp => temp.id === tId);
                    if (t) setPreviewTemplate(t.config);
                  }}
                  placeholder="Select Template"
                />
              </div>

              {previewTemplate && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">Primary Color</label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        value={previewTemplate.primaryColor} 
                        onChange={e => setPreviewTemplate({...previewTemplate, primaryColor: e.target.value})}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={previewTemplate.primaryColor} 
                        onChange={e => setPreviewTemplate({...previewTemplate, primaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {activeTab === 'id-cards' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500">Layout</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={previewTemplate.layout === 'portrait' ? 'primary' : 'outline'} 
                            size="sm"
                            onClick={() => setPreviewTemplate({...previewTemplate, layout: 'portrait'})}
                          >
                            Portrait
                          </Button>
                          <Button 
                            variant={previewTemplate.layout === 'landscape' ? 'primary' : 'outline'} 
                            size="sm"
                            onClick={() => setPreviewTemplate({...previewTemplate, layout: 'landscape'})}
                          >
                            Landscape
                          </Button>
                        </div>
                      </div>
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Show Address</span>
                          <input 
                            type="checkbox" 
                            checked={previewTemplate.showSchoolAddress} 
                            onChange={e => setPreviewTemplate({...previewTemplate, showSchoolAddress: e.target.checked})}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-500">Border Style</label>
                      <Select
                        options={[
                          { value: 'double', label: 'Double' },
                          { value: 'solid', label: 'Solid' },
                          { value: 'dashed', label: 'Dashed' },
                        ]}
                        value={previewTemplate.borderStyle}
                        onChange={e => setPreviewTemplate({...previewTemplate, borderStyle: e.target.value})}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white overflow-hidden border-none shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex justify-center bg-slate-800/50">
              {activeTab === 'id-cards' ? (
                <div 
                  className={`bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative transition-all duration-500 ${
                    previewTemplate?.layout === 'landscape' ? 'w-64 h-40' : 'w-48 h-72'
                  }`}
                >
                  <div className="h-1/4 p-2 text-center flex flex-col items-center justify-center" style={{ backgroundColor: previewTemplate?.primaryColor || '#1e40af', color: '#fff' }}>
                    <div className="text-[8px] font-black leading-tight uppercase tracking-tighter">EDU TRACK ACADEMY</div>
                  </div>
                  <div className="p-3 text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 border-2 border-slate-50 flex items-center justify-center">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-900 uppercase">John Doe</div>
                      <div className="text-[6px] font-black tracking-widest mb-2" style={{ color: previewTemplate?.primaryColor }}>STUDENT</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 w-full py-1.5 text-center bg-slate-50 border-t text-[5px] text-slate-400 uppercase font-black">
                    Official Student ID
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 w-64 h-80 border-8 relative" style={{ borderColor: previewTemplate?.primaryColor || '#1e40af', borderStyle: previewTemplate?.borderStyle || 'double' }}>
                  <div className="text-center space-y-2">
                    <div className="text-[8px] font-bold text-slate-400">EDU TRACK ACADEMY</div>
                    <div className="text-[12px] font-black underline uppercase" style={{ color: previewTemplate?.primaryColor }}>Certificate</div>
                    <div className="text-[6px] text-slate-600 italic">This is to certify that...</div>
                    <div className="text-[10px] font-bold text-slate-900">John Doe</div>
                    <div className="text-[6px] text-slate-600 leading-relaxed">has successfully completed his studies with excellent conduct...</div>
                    <div className="pt-8 flex justify-between px-4">
                      <div className="w-12 border-t border-slate-300 text-[4px] pt-1">TEACHER</div>
                      <div className="w-12 border-t border-slate-300 text-[4px] pt-1">PRINCIPAL</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'id-cards' ? 'Bulk Generate ID Cards' : 'Select Student for Certificate'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Class</label>
                  <Select
                    options={classes}
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    placeholder="Select Class"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Section</label>
                  <Select
                    options={[
                      { value: 'A', label: 'Section A' },
                      { value: 'B', label: 'Section B' },
                      { value: 'C', label: 'Section C' },
                    ]}
                    value={selectedSection}
                    onChange={e => setSelectedSection(e.target.value)}
                    placeholder="Select Section"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-1 shadow-lg shadow-blue-100"
                    onClick={handleGenerate}
                    disabled={generating || selectedStudentIds.length === 0}
                  >
                    {generating ? 'Generating...' : (
                      <><Download className="w-4 h-4 mr-2" /> 
                        {activeTab === 'id-cards' ? `Generate (${selectedStudentIds.length})` : 'Generate Certificate'}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {selectedClass && selectedSection && (
                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
                      <Users className="w-4 h-4" />
                      Student List ({students.length})
                    </div>
                    {activeTab === 'id-cards' && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
                        <Button variant="ghost" size="sm" onClick={clearSelection}>Clear</Button>
                      </div>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="p-12 text-center text-muted-foreground animate-pulse">Fetching records...</div>
                  ) : students.length > 0 ? (
                    <div className="max-h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                      {students.map(student => (
                        <div 
                          key={student.id}
                          onClick={() => toggleStudentSelection(student.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            selectedStudentIds.includes(student.id)
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${selectedStudentIds.includes(student.id) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedStudentIds.includes(student.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{student.fullName}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Roll: {student.rollNumber} | {student.studentId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      No students found in this section.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
