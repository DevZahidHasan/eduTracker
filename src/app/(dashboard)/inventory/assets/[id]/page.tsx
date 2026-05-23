'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  ArrowLeft, 
  Wrench, 
  Trash2, 
  Plus, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  History,
  DollarSign,
  Barcode,
  Save,
  ShieldCheck,
  Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Asset, AssetCondition, AssetStatus, AssetMaintenance } from '@/types/inventory';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    destructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: '',
    performedBy: '',
    nextMaintenanceDate: ''
  });

  const [editAsset, setEditAsset] = useState<Partial<Asset>>({});

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/inventory/${id}`);
      setAsset(res.data.data);
      setEditAsset(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch asset');
      router.push('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAsset = async () => {
    try {
      await api.patch(`/inventory/${id}`, editAsset);
      toast.success('Asset updated successfully');
      setIsEditing(false);
      fetchAsset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update asset');
    }
  };

  const handleAddMaintenance = async () => {
    try {
      await api.post('/inventory/maintenance', {
        assetId: parseInt(id as string),
        ...newLog,
        cost: parseFloat(newLog.cost) || 0
      });
      toast.success('Maintenance log added');
      setNewLog({
        date: new Date().toISOString().split('T')[0],
        description: '',
        cost: '',
        performedBy: '',
        nextMaintenanceDate: ''
      });
      fetchAsset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add maintenance log');
    }
  };

  const handleScrapAsset = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Scrap Asset',
      message: 'Are you sure you want to mark this asset as SCRAPPED? This should only be done if the item is no longer usable.',
      destructive: true,
      onConfirm: async () => {
        try {
          await api.patch(`/inventory/${id}`, { status: 'SCRAPPED' });
          toast.success('Asset marked as scrapped');
          fetchAsset();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to update status');
        }
      }
    });
  };

  if (loading) return <div className="flex justify-center py-20">Loading asset details...</div>;
  if (!asset) return <div className="text-center py-20 text-muted-foreground">Asset not found.</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/inventory')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
        <span className="font-mono text-sm px-2 py-1 bg-muted rounded border">{asset.assetId}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Asset Information
              </CardTitle>
              <Button 
                variant={isEditing ? 'outline' : 'primary'} 
                size="sm"
                onClick={() => isEditing ? handleUpdateAsset() : setIsEditing(true)}
              >
                {isEditing ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : 'Edit Details'}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      value={editAsset.name} 
                      onChange={e => setEditAsset({...editAsset, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <Input 
                      value={editAsset.category} 
                      onChange={e => setEditAsset({...editAsset, category: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      value={editAsset.location} 
                      onChange={e => setEditAsset({...editAsset, location: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Condition</label>
                    <Select
                      options={[
                        { value: 'NEW', label: 'New' },
                        { value: 'GOOD', label: 'Good' },
                        { value: 'FAIR', label: 'Fair' },
                        { value: 'POOR', label: 'Poor' },
                        { value: 'BROKEN', label: 'Broken' },
                      ]}
                      value={editAsset.condition}
                      onChange={e => setEditAsset({...editAsset, condition: e.target.value as AssetCondition})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      options={[
                        { value: 'ACTIVE', label: 'Active' },
                        { value: 'IN_REPAIR', label: 'In Repair' },
                        { value: 'SCRAPPED', label: 'Scrapped' },
                        { value: 'DISPOSED', label: 'Disposed' },
                        { value: 'LOST', label: 'Lost' },
                      ]}
                      value={editAsset.status}
                      onChange={e => setEditAsset({...editAsset, status: e.target.value as AssetStatus})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Serial Number</label>
                    <Input 
                      value={editAsset.serialNumber} 
                      onChange={e => setEditAsset({...editAsset, serialNumber: e.target.value})} 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Notes</label>
                    <Input 
                      value={editAsset.notes} 
                      onChange={e => setEditAsset({...editAsset, notes: e.target.value})} 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                      <p className="font-medium">{asset.location || 'Not Assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Condition</p>
                      <p className="font-medium">{asset.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</p>
                      <p className="font-medium">{asset.status}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Barcode className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Serial Number</p>
                      <p className="font-medium font-mono">{asset.serialNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Purchase Date</p>
                      <p className="font-medium">{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Purchase Cost</p>
                      <p className="font-medium">{asset.purchaseCost ? `$${asset.purchaseCost.toFixed(2)}` : 'N/A'}</p>
                    </div>
                  </div>
                  {asset.notes && (
                    <div className="md:col-span-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Notes</p>
                      <p className="text-sm">{asset.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Maintenance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {asset.maintenanceLogs && asset.maintenanceLogs.length > 0 ? (
                <div className="space-y-4">
                  {asset.maintenanceLogs.map((log: AssetMaintenance) => (
                    <div key={log.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-sm">{new Date(log.date).toLocaleDateString()}</p>
                        <p className="font-mono text-xs bg-muted px-2 py-0.5 rounded">${log.cost.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-foreground/80">{log.description}</p>
                      {log.performedBy && (
                        <p className="text-xs text-muted-foreground mt-2 italic">Performed by: {log.performedBy}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No maintenance logs found for this asset.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Log Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={newLog.date}
                  onChange={e => setNewLog({...newLog, date: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="What was done?"
                  value={newLog.description}
                  onChange={e => setNewLog({...newLog, description: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cost</label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={newLog.cost}
                  onChange={e => setNewLog({...newLog, cost: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Performed By</label>
                <Input 
                  placeholder="e.g. IT Dept, External Service"
                  value={newLog.performedBy}
                  onChange={e => setNewLog({...newLog, performedBy: e.target.value})}
                />
              </div>
              <div className="space-y-1.5 pt-2 border-t">
                <label className="text-sm font-medium flex items-center gap-1.5 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  Next Maintenance Due
                </label>
                <Input 
                  type="date"
                  value={newLog.nextMaintenanceDate}
                  onChange={e => setNewLog({...newLog, nextMaintenanceDate: e.target.value})}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAddMaintenance}
                disabled={!newLog.description}
              >
                <Plus className="w-4 h-4 mr-2" /> Log Maintenance
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-red-600">
                Marking an asset as scrapped or disposed will remove it from the active inventory lists.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleScrapAsset}
                disabled={asset.status === 'SCRAPPED'}
              >
                Scrap Asset
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        destructive={confirmModal.destructive}
      />
    </div>
  );
}
