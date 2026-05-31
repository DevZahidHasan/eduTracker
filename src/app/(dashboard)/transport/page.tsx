'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Bus, Users, Map, Settings, Trash2, Edit, UserPlus, Info, Activity, Clock, CheckCircle, AlertTriangle, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'vehicles' | 'drivers' | 'assignments'>('routes');
  const [loading, setLoading] = useState(true);

  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  // Assignment States
  const [classesList, setClassesList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [tableFilterClass, setTableFilterClass] = useState('all');
  const [tableFilterSection, setTableFilterSection] = useState('all');

  // Stop Management States
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedRouteForStops, setSelectedRouteForStops] = useState<any>(null);
  const [newStop, setNewStop] = useState({ name: '', pickupTime: '', dropTime: '', fare: '' });

  // Live Tracking States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRouteForStatus, setSelectedRouteForStatus] = useState<any>(null);
  const [statusForm, setStatusStatusForm] = useState({ currentStatus: 'ON_TIME', delayMinutes: 0, lastLocation: '' });

  // Modals
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
    isOpen: false, title: '', message: '', onConfirm: () => {}
  });

  // Forms
  const [newVehicle, setNewVehicle] = useState({ registrationNumber: '', make: '', model: '', capacity: 0 });
  const [newDriver, setNewDriver] = useState({ name: '', licenseNumber: '', phone: '' });
  const [newRoute, setNewRoute] = useState({ name: '', description: '', fare: 0, vehicleId: '', driverId: '' });
  const [newAssignment, setNewAssignment] = useState({ studentId: '', busRouteId: '', busStopId: '' });

  // Editing States
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedClass) {
      api.get(`/students?className=${selectedClass}`).then(res => {
        setStudentsList(res.data.data || []);
      }).catch(console.error);
    } else {
      setStudentsList([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (activeTab === 'assignments') {
      const routeParam = selectedRoute === '' || selectedRoute === 'all' ? 'all' : selectedRoute;
      api.get(`/transport/routes/${routeParam}/students`).then(res => {
        setAssignedStudents(res.data.data || []);
      }).catch(console.error);
    }
  }, [activeTab, selectedRoute]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'routes') {
        const [rRes, vRes, dRes] = await Promise.all([
          api.get('/transport/routes'),
          api.get('/transport/vehicles'),
          api.get('/transport/drivers')
        ]);
        setRoutes(rRes.data.data);
        setVehicles(vRes.data.data);
        setDrivers(dRes.data.data);
      } else if (activeTab === 'vehicles') {
        const res = await api.get('/transport/vehicles');
        setVehicles(res.data.data);
      } else if (activeTab === 'drivers') {
        const res = await api.get('/transport/drivers');
        setDrivers(res.data.data);
      } else if (activeTab === 'assignments') {
        const [cRes, rRes] = await Promise.all([
          api.get('/classes/overview'),
          api.get('/transport/routes')
        ]);
        setClassesList(cRes.data.data || cRes.data || []);
        setRoutes(rRes.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // --- Live Status ---
  const handleUpdateStatus = async () => {
    if (!selectedRouteForStatus) return;
    try {
      await api.put(`/transport/routes/${selectedRouteForStatus.id}/status`, statusForm);
      toast.success('Bus status updated successfully');
      setIsStatusModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TIME': return 'bg-emerald-500 text-white';
      case 'DELAYED': return 'bg-amber-500 text-white';
      case 'BREAKDOWN': return 'bg-red-500 text-white';
      case 'COMPLETED': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  // --- Vehicles ---
  const handleAddVehicle = async () => {
    try {
      if (editingVehicle) {
        await api.put(`/transport/vehicles/${editingVehicle.id}`, newVehicle);
        toast.success('Vehicle updated');
        setEditingVehicle(null);
      } else {
        await api.post('/transport/vehicles', newVehicle);
        toast.success('Vehicle added');
      }
      setNewVehicle({ registrationNumber: '', make: '', model: '', capacity: 0 });
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save vehicle'); }
  };

  const handleEditVehicle = (v: any) => {
    setEditingVehicle(v);
    setNewVehicle({
      registrationNumber: v.registrationNumber,
      make: v.make,
      model: v.model,
      capacity: v.capacity
    });
  };

  const confirmDeleteVehicle = (id: number) => {
    setConfirmModal({
      isOpen: true, title: 'Delete Vehicle', message: 'Delete this vehicle?',
      onConfirm: async () => {
        try {
          await api.delete(`/transport/vehicles/${id}`);
          toast.success('Vehicle deleted');
          fetchData();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete vehicle'); }
      }
    });
  };

  // --- Drivers ---
  const handleAddDriver = async () => {
    try {
      if (editingDriver) {
        await api.put(`/transport/drivers/${editingDriver.id}`, newDriver);
        toast.success('Driver updated');
        setEditingDriver(null);
      } else {
        await api.post('/transport/drivers', newDriver);
        toast.success('Driver added');
      }
      setNewDriver({ name: '', licenseNumber: '', phone: '' });
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save driver'); }
  };

  const handleEditDriver = (d: any) => {
    setEditingDriver(d);
    setNewDriver({
      name: d.name,
      licenseNumber: d.licenseNumber,
      phone: d.phone
    });
  };

  const confirmDeleteDriver = (id: number) => {
    setConfirmModal({
      isOpen: true, title: 'Delete Driver', message: 'Delete this driver?',
      onConfirm: async () => {
        try {
          await api.delete(`/transport/drivers/${id}`);
          toast.success('Driver deleted');
          fetchData();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete driver'); }
      }
    });
  };

  // --- Routes ---
  const handleAddRoute = async () => {
    try {
      if (editingRoute) {
        await api.put(`/transport/routes/${editingRoute.id}`, newRoute);
        toast.success('Route updated');
        setEditingRoute(null);
      } else {
        await api.post('/transport/routes', newRoute);
        toast.success('Route added');
      }
      setNewRoute({ name: '', description: '', fare: 0, vehicleId: '', driverId: '' });
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save route'); }
  };

  const handleEditRoute = (r: any) => {
    setEditingRoute(r);
    setNewRoute({
      name: r.name,
      description: r.description || '',
      fare: r.fare,
      vehicleId: r.vehicle?.vehicleId || '',
      driverId: r.driver?.driverId || ''
    });
  };

  const confirmDeleteRoute = (id: number) => {
    setConfirmModal({
      isOpen: true, title: 'Delete Route', message: 'Delete this route?',
      onConfirm: async () => {
        try {
          await api.delete(`/transport/routes/${id}`);
          toast.success('Route deleted');
          fetchData();
        } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to delete route'); }
      }
    });
  };

  // --- Stops ---
  const handleAddStop = async () => {
    if (!selectedRouteForStops) return;
    try {
      await api.post(`/transport/routes/${selectedRouteForStops.id}/stops`, {
        ...newStop,
        fare: newStop.fare ? parseFloat(newStop.fare) : null
      });
      toast.success('Bus stop added');
      setNewStop({ name: '', pickupTime: '', dropTime: '', fare: '' });
      // Refresh route data
      const res = await api.get('/transport/routes');
      const updatedRoutes = res.data.data;
      setRoutes(updatedRoutes);
      setSelectedRouteForStops(updatedRoutes.find((r: any) => r.id === selectedRouteForStops.id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId: number) => {
    try {
      await api.delete(`/transport/stops/${stopId}`);
      toast.success('Bus stop removed');
      const res = await api.get('/transport/routes');
      const updatedRoutes = res.data.data;
      setRoutes(updatedRoutes);
      setSelectedRouteForStops(updatedRoutes.find((r: any) => r.id === selectedRouteForStops.id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete stop');
    }
  };

  // --- Assignments ---
  const handleAssignTransport = async () => {
    try {
      await api.post('/transport/assign', newAssignment);
      toast.success(editingAssignment ? 'Assignment updated' : 'Student assigned to transport');
      setNewAssignment({ studentId: '', busRouteId: '', busStopId: '' });
      setEditingAssignment(null);
      const routeParam = selectedRoute === '' || selectedRoute === 'all' ? 'all' : selectedRoute;
      if (routeParam === 'all' || routeParam === newAssignment.busRouteId) {
        const res = await api.get(`/transport/routes/${routeParam}/students`);
        setAssignedStudents(res.data.data || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign transport');
    }
  };

  const handleEditAssignment = (s: any) => {
    setEditingAssignment(s);
    setSelectedClass(s.className);
    setSelectedSection(s.section);
    setNewAssignment({
      studentId: s.id.toString(),
      busRouteId: s.busRouteId?.toString() || '',
      busStopId: s.busStopId?.toString() || ''
    });
  };

  const handleUnassignStudent = async (studentId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Assignment',
      message: 'Are you sure you want to remove this student from the transport route?',
      onConfirm: async () => {
        try {
          await api.post('/transport/assign', { studentId, busRouteId: null, busStopId: null });
          toast.success('Student removed from route');
          const routeParam = selectedRoute === '' || selectedRoute === 'all' ? 'all' : selectedRoute;
          const res = await api.get(`/transport/routes/${routeParam}/students`);
          setAssignedStudents(res.data.data || []);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to remove assignment');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transport & Fleet</h1>
          <p className="text-muted-foreground mt-1">Manage school vehicles, drivers, bus routes, and student transportation.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
          <Bus size={18} />
          <span className="text-sm font-semibold">Total Vehicles: {vehicles.length}</span>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit border border-border/50">
        {[
          { id: 'routes', icon: Map, label: 'Bus Routes' },
          { id: 'vehicles', icon: Bus, label: 'Fleet Inventory' },
          { id: 'drivers', icon: Users, label: 'Driver Staff' },
          { id: 'assignments', icon: UserPlus, label: 'Student Assignments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-card text-primary shadow-sm border border-border' 
                : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-1 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Add New Vehicle</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registration Number</label>
                <Input placeholder="e.g. ABC-1234" value={newVehicle.registrationNumber} onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Make</label>
                  <Input placeholder="Toyota" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model</label>
                  <Input placeholder="Coaster" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Passenger Capacity</label>
                <Input type="number" value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value) || 0})} />
              </div>
              <Button className="w-full" onClick={handleAddVehicle} disabled={!newVehicle.registrationNumber}>
                {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Fleet Inventory</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map(v => (
                    <div key={v.id} className="p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors group relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary tracking-tight">{v.vehicleId}</p>
                          <p className="font-bold text-foreground leading-none">{v.registrationNumber}</p>
                          <p className="text-sm text-muted-foreground">{v.make} {v.model}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                          {v.status}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Capacity: <span className="font-bold text-foreground">{v.capacity}</span></span>
                        <div className="flex gap-2 transition-opacity">
                          <button onClick={() => handleEditVehicle(v)} className="text-primary hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/5">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => confirmDeleteVehicle(v.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-10 text-muted-foreground italic">No vehicles registered yet.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-1 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Add New Driver</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Driver Full Name</label>
                <Input placeholder="John Doe" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">License Number</label>
                <Input placeholder="DL-XXXX-XXXX" value={newDriver.licenseNumber} onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                <Input placeholder="+1 234 567 890" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} />
              </div>
              <Button className="w-full" onClick={handleAddDriver} disabled={!newDriver.licenseNumber || !newDriver.name}>
                {editingDriver ? 'Update Driver' : 'Register Driver'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Registered Drivers</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : drivers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drivers.map(d => (
                    <div key={d.id} className="p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors group relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary tracking-tight">{d.driverId}</p>
                          <p className="font-bold text-foreground leading-none">{d.name}</p>
                          <p className="text-xs font-medium text-muted-foreground font-mono mt-1">{d.licenseNumber}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {d.status}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Phone: <span className="font-bold text-foreground">{d.phone || 'N/A'}</span></span>
                        <div className="flex gap-2 transition-opacity">
                          <button onClick={() => handleEditDriver(d)} className="text-primary hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/5">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => confirmDeleteDriver(d.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-10 text-muted-foreground italic">No drivers registered yet.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-1 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Create New Route</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Route Name</label>
                <Input placeholder="Downtown Express" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Monthly Fare</label>
                <Input type="number" value={newRoute.fare} onChange={e => setNewRoute({...newRoute, fare: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Assign Vehicle</label>
                <Input list="v-list" placeholder="Search Vehicle..." value={newRoute.vehicleId} onChange={e => setNewRoute({...newRoute, vehicleId: e.target.value})} />
                <datalist id="v-list">{vehicles.map(v => <option key={v.id} value={v.vehicleId}>{v.registrationNumber}</option>)}</datalist>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Assign Driver</label>
                <Input list="d-list" placeholder="Search Driver..." value={newRoute.driverId} onChange={e => setNewRoute({...newRoute, driverId: e.target.value})} />
                <datalist id="d-list">{drivers.map(d => <option key={d.id} value={d.driverId}>{d.name}</option>)}</datalist>
              </div>
              <Button className="w-full mt-2" onClick={handleAddRoute} disabled={!newRoute.name}>
                {editingRoute ? 'Update Route' : 'Launch Route'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Active Bus Routes</CardTitle></CardHeader>
            <CardContent>
              {loading ? <p>Loading...</p> : routes.length > 0 ? (
                <div className="space-y-4">
                  {routes.map(r => (
                    <div key={r.id} className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary"><Map size={20} /></div>
                          <div>
                            <p className="font-bold text-lg leading-tight">{r.name}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Monthly Fare: ${r.fare}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs flex items-center gap-1.5"
                            onClick={() => {
                              setSelectedRouteForStops(r);
                              setIsStopsModalOpen(true);
                            }}
                          >
                            <Settings size={14} /> Manage Stops
                          </Button>
                          <div className="flex gap-1 transition-opacity">
                            <button onClick={() => handleEditRoute(r)} className="text-primary hover:text-primary/80 transition-colors p-2 rounded-lg hover:bg-primary/5">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => confirmDeleteRoute(r.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Live Tracking Status Bar */}
                      <div className={`mb-4 flex items-center justify-between px-3 py-2 rounded-xl border ${getStatusColor(r.currentStatus)}`}>
                        <div className="flex items-center gap-2">
                          <Activity size={16} />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none opacity-80">Live Status</p>
                            <p className="text-xs font-bold leading-tight">{r.currentStatus.replace('_', ' ')} {r.delayMinutes > 0 ? `(${r.delayMinutes}m delay)` : ''}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 border-none text-white"
                          onClick={() => {
                            setSelectedRouteForStatus(r);
                            setStatusStatusForm({ 
                              currentStatus: r.currentStatus, 
                              delayMinutes: r.delayMinutes, 
                              lastLocation: r.lastLocation || '' 
                            });
                            setIsStatusModalOpen(true);
                          }}
                        >
                          Update Status
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 bg-muted/30 p-3 rounded-lg border border-border/30">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vehicle</p>
                          <p className="text-sm font-semibold">{r.vehicle?.vehicleId || 'N/A'} <span className="text-muted-foreground font-normal">({r.vehicle?.registrationNumber || 'No Bus'})</span></p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Driver</p>
                          <p className="text-sm font-semibold">{r.driver?.name || 'Unassigned'} <span className="text-muted-foreground font-normal text-xs font-mono">[{r.driver?.driverId || '---'}]</span></p>
                        </div>
                        <div className="col-span-2 pt-2 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-primary" />
                            <span className="text-xs font-bold">{r._count?.students || 0} Students Assigned</span>
                          </div>
                          {r.stops?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {r.stops.map((s: any) => (
                                <span key={s.id} className="px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-medium">
                                  {s.name} ({s.pickupTime})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-10 text-muted-foreground">No routes created yet.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manage Stops Modal */}
      {isStopsModalOpen && selectedRouteForStops && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Manage Stops: {selectedRouteForStops.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsStopsModalOpen(false)} className="rounded-full w-8 h-8 p-0">✕</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Add New Stop</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Stop Name</label>
                    <Input placeholder="Main Street Junction" value={newStop.name} onChange={e => setNewStop({...newStop, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Pickup Time</label>
                    <Input type="time" value={newStop.pickupTime} onChange={e => setNewStop({...newStop, pickupTime: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Drop Time</label>
                    <Input type="time" value={newStop.dropTime} onChange={e => setNewStop({...newStop, dropTime: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Extra Fare (Opt)</label>
                    <Input type="number" placeholder="Adds to Base Fare" value={newStop.fare} onChange={e => setNewStop({...newStop, fare: e.target.value})} />
                  </div>
                  <div className="col-span-2 md:col-span-4 pt-2">
                    <Button onClick={handleAddStop} className="w-full h-10" disabled={!newStop.name || !newStop.pickupTime}>Add This Stop to Route</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Route Stops</p>
                {selectedRouteForStops.stops?.length > 0 ? (
                  <div className="divide-y divide-border/30 border border-border/50 rounded-xl overflow-hidden bg-card">
                    {selectedRouteForStops.stops.map((stop: any) => (
                      <div key={stop.id} className="flex justify-between items-center p-3 hover:bg-muted/20 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <p className="text-sm font-bold">{stop.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Pickup: {stop.pickupTime} • Drop: {stop.dropTime} {stop.fare && `• Custom Fare: $${stop.fare}`}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteStop(stop.id)} className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-muted/10 rounded-xl border border-dashed border-border text-muted-foreground italic text-sm">
                    No stops defined yet. Add the first pickup point above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-1 shadow-sm border-border/60">
            <CardHeader><CardTitle className="text-lg">Assign Student to Route</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Class</label>
                <Select
                  options={classesList.map(c => ({ value: c.className, label: c.className.replace('_', ' ') }))}
                  value={selectedClass}
                  onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); setNewAssignment({ ...newAssignment, studentId: '' }); }}
                  placeholder="Choose Class"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Section</label>
                <Select
                  options={(classesList.find(c => c.className === selectedClass)?.sections || []).map((s: any) => ({ value: s.section, label: s.section }))}
                  value={selectedSection}
                  onChange={e => { setSelectedSection(e.target.value); setNewAssignment({ ...newAssignment, studentId: '' }); }}
                  placeholder="Choose Section"
                  disabled={!selectedClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Student</label>
                <Select
                  options={studentsList
                    .filter(s => 
                      (!selectedSection || s.section === selectedSection) && 
                      (!s.busRouteId || editingAssignment?.id === s.id)
                    )
                    .map(s => ({ value: s.id, label: `${s.fullName} (${s.rollNumber})` }))}
                  value={newAssignment.studentId}
                  onChange={e => setNewAssignment({ ...newAssignment, studentId: e.target.value })}
                  placeholder="Select Student"
                  disabled={!selectedClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Target Route</label>
                <Select
                  options={routes.map(r => ({ value: r.id, label: r.name }))}
                  value={newAssignment.busRouteId}
                  onChange={e => setNewAssignment({ ...newAssignment, busRouteId: e.target.value, busStopId: '' })}
                  placeholder="Assign to Route"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Bus Stop (Optional)</label>
                <Select
                  options={(routes.find(r => r.id == newAssignment.busRouteId)?.stops || []).map((s: any) => ({ value: s.id, label: s.name }))}
                  value={newAssignment.busStopId}
                  onChange={e => setNewAssignment({ ...newAssignment, busStopId: e.target.value })}
                  placeholder="Select Stop"
                  disabled={!newAssignment.busRouteId}
                />
              </div>
              <Button className="w-full mt-2" onClick={handleAssignTransport} disabled={!newAssignment.studentId || !newAssignment.busRouteId}>
                {editingAssignment ? 'Update Assignment' : 'Confirm Assignment'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 gap-4">
              <CardTitle className="text-lg whitespace-nowrap">Current Assignments</CardTitle>
              <div className="flex flex-row items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <div className="w-40 min-w-[160px]">
                  <Select
                    options={[{ value: 'all', label: 'All Classes' }, ...classesList.map(c => ({ value: c.className, label: c.className.replace('_', ' ') }))]}
                    value={tableFilterClass}
                    onChange={e => { setTableFilterClass(e.target.value); setTableFilterSection('all'); }}
                    placeholder="Filter Class"
                  />
                </div>
                <div className="w-40 min-w-[160px]">
                  <Select
                    options={[{ value: 'all', label: 'All Sections' }, ...(tableFilterClass !== 'all' ? (classesList.find(c => c.className === tableFilterClass)?.sections || []).map((s: any) => ({ value: s.section, label: s.section })) : [])]}
                    value={tableFilterSection}
                    onChange={e => setTableFilterSection(e.target.value)}
                    placeholder="Filter Section"
                    disabled={tableFilterClass === 'all'}
                  />
                </div>
                <div className="w-48 min-w-[192px]">
                  <Select
                    options={[{ value: 'all', label: 'All Routes' }, ...routes.map(r => ({ value: r.id, label: r.name }))]}
                    value={selectedRoute || 'all'}
                    onChange={e => setSelectedRoute(e.target.value)}
                    placeholder="Filter Route"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assignedStudents.filter(s => (tableFilterClass === 'all' || s.className === tableFilterClass) && (tableFilterSection === 'all' || s.section === tableFilterSection)).length > 0 ? (
                <div className="overflow-hidden border border-border/50 rounded-xl bg-card">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border/50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Student</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Class</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Route & Bus</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Bus Stop</th>
                        <th className="px-4 py-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {assignedStudents.filter(s => (tableFilterClass === 'all' || s.className === tableFilterClass) && (tableFilterSection === 'all' || s.section === tableFilterSection)).map(s => (
                        <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-bold">{s.fullName}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">#{s.studentId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{s.className} - {s.section}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">{s.busRoute?.name || 'N/A'}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{s.busRoute?.vehicle?.registrationNumber || 'No Bus'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm italic text-muted-foreground">{s.busStop?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1 justify-end transition-all">
                              <button onClick={() => handleEditAssignment(s)} className="text-primary hover:text-primary/80 p-1.5 rounded-lg hover:bg-primary/5">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleUnassignStudent(s.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-center py-10 text-muted-foreground italic">No students assigned to transport yet.</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        destructive={confirmModal.title.includes('Delete') || confirmModal.title.includes('Remove')}
        confirmText={confirmModal.title.includes('Delete') ? 'Delete' : confirmModal.title.includes('Remove') ? 'Remove' : 'Confirm'}
      />

      {/* Live Status Update Modal */}
      {isStatusModalOpen && selectedRouteForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl overflow-hidden">
            <div className={`h-1.5 w-full ${getStatusColor(statusForm.currentStatus)}`}></div>
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  Live Status: {selectedRouteForStatus.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsStatusModalOpen(false)} className="rounded-full w-8 h-8 p-0 text-muted-foreground">✕</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Route Status</label>
                  <Select
                    value={statusForm.currentStatus}
                    onChange={(e) => setStatusStatusForm({ ...statusForm, currentStatus: e.target.value })}
                    options={[
                      { value: 'ON_TIME', label: '✅ On Time' },
                      { value: 'DELAYED', label: '⏳ Delayed' },
                      { value: 'BREAKDOWN', label: '⚠️ Breakdown / Alert' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delay (Minutes)</label>
                    <Input 
                      type="number" 
                      value={statusForm.delayMinutes} 
                      onChange={(e) => setStatusStatusForm({ ...statusForm, delayMinutes: parseInt(e.target.value) || 0 })} 
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5 text-center flex flex-col justify-center bg-muted/30 rounded-xl border border-border/50">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Estimated</p>
                    <p className="text-sm font-bold text-foreground">{statusForm.delayMinutes} min late</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Location (Optional)</label>
                  <Input 
                    value={statusForm.lastLocation} 
                    onChange={(e) => setStatusStatusForm({ ...statusForm, lastLocation: e.target.value })} 
                    placeholder="e.g. Near City Center Mall"
                  />
                </div>

                <div className="pt-4 border-t border-border/30 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                  <Button className="flex-1 gap-2" onClick={handleUpdateStatus}>
                    <Activity size={16} /> Broadcast Update
                  </Button>
                </div>
                <p className="text-[9px] text-center text-muted-foreground font-medium italic">
                  * Updating status will immediately notify all linked parents.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
