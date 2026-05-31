'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchParentDashboard, 
  selectParentDashboardData, 
  fetchParentTransport, 
  selectParentTransportData,
  selectParentTransportLoading
} from '@/lib/features/parentSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Navigation,
  RefreshCw,
  Info
} from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

export default function TransportTrackingPage() {
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectParentDashboardData);
  const transportData = useAppSelector(selectParentTransportData);
  const loading = useAppSelector(selectParentTransportLoading);
  
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
      dispatch(fetchParentTransport({ studentId: selectedStudentId }));
    }
  }, [dispatch, selectedStudentId]);

  const handleRefresh = () => {
    if (selectedStudentId) {
      dispatch(fetchParentTransport({ studentId: selectedStudentId }));
    }
  };

  if (dashboardData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 bg-slate-50 rounded-full text-slate-300 border border-slate-100 mb-4">
          <Bus size={48} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No Students Linked</h3>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ON_TIME':
        return { 
          label: 'On Time', 
          color: 'text-emerald-600', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-100',
          icon: <CheckCircle size={16} /> 
        };
      case 'DELAYED':
        return { 
          label: 'Delayed', 
          color: 'text-amber-600', 
          bg: 'bg-amber-50', 
          border: 'border-amber-100',
          icon: <Clock size={16} /> 
        };
      case 'BREAKDOWN':
        return { 
          label: 'Breakdown', 
          color: 'text-red-600', 
          bg: 'bg-red-50', 
          border: 'border-red-100',
          icon: <AlertTriangle size={16} /> 
        };
      default:
        return { 
          label: 'Status Unknown', 
          color: 'text-slate-600', 
          bg: 'bg-slate-50', 
          border: 'border-slate-100',
          icon: <Info size={16} /> 
        };
    }
  };

  const studentOptions = dashboardData.map(d => ({
    value: d.student.id.toString(),
    label: d.student.fullName
  }));

  const route = transportData?.route;
  const assignedStop = transportData?.assignedStop;
  const status = route ? getStatusDisplay(route.currentStatus) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Bus Tracking</h1>
          <p className="text-sm text-slate-500">Real-time updates for school transport</p>
        </div>
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
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {!route ? (
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
              <MapPin size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Transport Assigned</h3>
            <p className="text-slate-500 text-sm mt-1">This student is not registered for any school bus route.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/60 shadow-lg overflow-hidden">
              <div className={`h-2 w-full ${status?.bg.replace('bg-', 'bg-').split(' ')[0].replace('-50', '-500') || 'bg-primary'}`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl">
                      <Bus size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{route.name}</h2>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{route.vehicle?.registrationNumber || 'No Vehicle'}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl border-2 ${status?.bg} ${status?.color} ${status?.border} flex items-center gap-2 font-black text-sm uppercase tracking-wider`}>
                    {status?.icon}
                    {status?.label}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Reported Location</p>
                      <p className="text-sm font-bold text-slate-900">{route.lastLocation || 'Starting Point'}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Delay</p>
                      <p className="text-sm font-bold text-slate-900">{route.delayMinutes} Minutes</p>
                    </div>
                  </div>
                </div>

                {route.lastStatusUpdate && (
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-6 tracking-widest">
                    Last Updated: {format(new Date(route.lastStatusUpdate), 'MMM dd, hh:mm a')}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Route Timeline */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Navigation size={20} className="text-primary" />
                  Route Stops
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
                  {route.stops.map((stop: any, idx: number) => {
                    const isMyStop = assignedStop?.id === stop.id;
                    return (
                      <div key={stop.id} className="relative flex items-center gap-6">
                        <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-md ${isMyStop ? 'bg-primary text-white scale-110' : 'bg-slate-200 text-slate-400'}`}>
                          {isMyStop ? <MapPin size={16} /> : <span className="text-xs font-black">{idx + 1}</span>}
                        </div>
                        <div className="flex-1 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-all shadow-sm">
                          <div>
                            <h4 className={`text-sm font-bold ${isMyStop ? 'text-primary' : 'text-slate-900'}`}>
                              {stop.name}
                              {isMyStop && <span className="ml-2 text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Your Child's Stop</span>}
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Arrival: {stop.pickupTime || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Status</p>
                            <p className="text-[10px] font-bold text-slate-400">{idx === 0 ? 'Departed' : 'Scheduled'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-900 text-white pb-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Driver Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{route.driver?.name || 'Assigned Driver'}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID: {route.driver?.driverId || 'N/A'}</p>
                  </div>
                </div>
                
                {route.driver?.phone && (
                  <a href={`tel:${route.driver.phone}`} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all">
                    <Phone size={16} />
                    Call Driver
                  </a>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm bg-blue-50/30 border-blue-100/50">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  <Info size={16} />
                  Emergency Help
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  If you have concerns about the bus route or delay, please contact the school's transport office directly.
                </p>
                <div className="pt-2 border-t border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Office Hotline</p>
                  <p className="text-sm font-bold text-blue-900">+880 1234 567890</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
