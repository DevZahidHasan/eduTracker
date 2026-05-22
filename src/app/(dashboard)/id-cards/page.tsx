'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Printer, 
  Download, 
  Filter, 
  CreditCard,
  IdCard,
  MapPin,
  Phone,
  Droplets
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectSchoolProfile, fetchSchoolProfile } from '@/lib/features/settingsSlice';
import { selectClasses, fetchConfig } from '@/lib/features/configSlice';
import { selectAllStudents, fetchStudents } from '@/lib/features/studentsSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import { QRCodeSVG } from 'qrcode.react';

// --- ID Card Component ---
const StudentIDCard = ({ student, schoolProfile }: { student: any, schoolProfile: any }) => {
  return (
    <div className="id-card-container w-[54mm] h-[86mm] bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm relative flex flex-col font-sans">
      {/* Background Pattern/Accents */}
      <div className="absolute top-0 left-0 w-full h-[35mm] bg-primary/10 -skew-y-6 origin-top-left -z-10" />
      <div className="absolute bottom-0 right-0 w-full h-[20mm] bg-primary/5 skew-y-6 origin-bottom-right -z-10" />

      {/* Header */}
      <div className="p-3 text-center flex flex-col items-center gap-1">
        {schoolProfile?.logo && (
          <img src={schoolProfile.logo} alt="School Logo" className="h-8 w-auto object-contain mb-1" />
        ) || (
            <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                <IdCard size={14} className="text-primary" />
            </div>
        )}
        <h2 className="text-[9px] font-black text-slate-800 uppercase tracking-tight leading-tight line-clamp-2">
          {schoolProfile?.name || 'EduTrack Academy'}
        </h2>
      </div>

      {/* Student Photo */}
      <div className="flex justify-center mt-1">
        <div className="w-[24mm] h-[28mm] bg-slate-100 rounded-lg border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
          {student.profileImage ? (
            <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" />
          ) : (
            <Users size={32} className="text-slate-300" />
          )}
        </div>
      </div>

      {/* Student Info */}
      <div className="flex-1 px-3 py-2 text-center">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1 line-clamp-1">
          {student.fullName}
        </h3>
        
        <div className="space-y-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center justify-center gap-1">
            <span className="text-slate-400">ID:</span>
            <span className="text-slate-800">{student.studentId}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-slate-400">Roll:</span>
            <span className="text-slate-800">{student.rollNumber}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-slate-400">Class:</span>
            <span className="text-slate-800">{student.className}-{student.section}</span>
          </div>
        </div>

        {student.bloodGroup && (
          <div className="mt-2 flex items-center justify-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full w-fit mx-auto border border-red-100">
            <Droplets size={8} />
            <span className="text-[7px] font-black">{student.bloodGroup}</span>
          </div>
        )}
      </div>

      {/* Footer / QR Code */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
        <div className="text-[6px] font-bold text-slate-400 text-left leading-tight">
          <div className="flex items-center gap-1">
             <MapPin size={6} /> {schoolProfile?.address || 'School Campus'}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
             <Phone size={6} /> {schoolProfile?.phone || 'Emergency Contact'}
          </div>
        </div>
        <div className="bg-white p-1 rounded border border-slate-200">
           <QRCodeSVG 
            value={student.studentId} 
            size={24} 
            level="L"
            includeMargin={false}
           />
        </div>
      </div>

      {/* Security Hologram Effect */}
      <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-tr from-yellow-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-[1px]" />
    </div>
  );
};

// --- Printable Grid Component ---
const PrintGrid = React.forwardRef(({ students, schoolProfile }: { students: any[], schoolProfile: any }, ref: any) => {
  return (
    <div ref={ref} className="print-area bg-white w-full max-w-[210mm] mx-auto">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4; 
            margin: 0; 
          }
          body { 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            background: white !important;
          }
          .print-area { 
            padding: 15mm !important;
            display: grid !important; 
            grid-template-columns: repeat(2, 54mm) !important; 
            gap: 15mm 20mm !important; 
            justify-content: center !important;
            align-content: start !important;
            background: white !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            page-break-after: always;
          }
          .id-card-wrapper { 
            break-inside: avoid !important; 
            page-break-inside: avoid !important; 
            width: 54mm !important;
            height: 86mm !important;
          }
          .id-card-container {
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            width: 54mm !important;
            height: 86mm !important;
          }
          .action-bar, .no-print, header, nav, .sidebar {
            display: none !important;
          }
        }
      `}} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center print:grid print:grid-cols-2 print:gap-x-20 print:gap-y-12">
        {students.map((student) => (
          <div key={student.id} className="id-card-wrapper">
            <StudentIDCard student={student} schoolProfile={schoolProfile} />
          </div>
        ))}
      </div>
    </div>
  );
});

PrintGrid.displayName = 'PrintGrid';

// --- Main Page ---
export default function IDCardsPage() {
  const dispatch = useAppDispatch();
  const printRef = useRef(null);
  
  const CLASSES = useAppSelector(selectClasses);
  const students = useAppSelector(selectAllStudents);
  const schoolProfile = useAppSelector(selectSchoolProfile);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(fetchStudents());
    dispatch(fetchSchoolProfile());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return students;
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `ID_Cards_${selectedClass || 'All'}`,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="text-primary" />
            ID Card Studio
          </h1>
          <p className="text-slate-500 font-medium mt-1">Design and generate bulk student identification cards.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            onClick={() => handlePrint()} 
            className="shadow-lg shadow-blue-200 gap-2"
            disabled={filteredStudents.length === 0}
          >
             <Printer size={18} />
             Print All Cards
           </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/60 shadow-sm">
        <div className="p-6 flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Grade / Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:ring-4 focus:ring-primary/5 outline-none transition-standard"
            >
              <option value="">All Classes</option>
              {CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-3 h-10">
             <Users size={16} className="text-blue-600" />
             <span className="text-sm font-bold text-blue-800">
               {filteredStudents.length} Students Selected
             </span>
          </div>
        </div>
      </Card>

      {/* Preview Area */}
      <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 min-h-[500px]">
        {filteredStudents.length > 0 ? (
          <PrintGrid 
            ref={printRef} 
            students={filteredStudents} 
            schoolProfile={schoolProfile} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-6 bg-white rounded-full shadow-sm mb-4">
               <CreditCard size={48} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Students Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
              Select a class from the filter above to preview and print ID cards.
            </p>
          </div>
        )}
      </div>

      {/* Layout Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-white border-slate-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Printer size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Print Format</p>
                  <p className="text-sm font-black text-slate-700 uppercase">Standard A4 Sheet</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-white border-slate-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Card Size</p>
                  <p className="text-sm font-black text-slate-700 uppercase">CR80 (54mm x 86mm)</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-white border-slate-100">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Download size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Capacity</p>
                  <p className="text-sm font-black text-slate-700 uppercase">8-10 Cards Per Page</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
