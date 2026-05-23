'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Package, 
  Wrench, 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Info,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Asset, AssetCondition, AssetStatus } from '@/types/inventory';
import Link from 'next/link';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'assets' | 'maintenance'>('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: '',
    purchaseDate: '',
    purchaseCost: '',
    condition: 'NEW' as AssetCondition,
    location: '',
    serialNumber: '',
    notes: ''
  });

  const categories = ['Furniture', 'Computer', 'Lab Equipment', 'Electronics', 'Sports', 'Other'];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setAssets(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = async () => {
    try {
      await api.post('/inventory', {
        ...newAsset,
        purchaseCost: parseFloat(newAsset.purchaseCost) || 0
      });
      toast.success('Asset added successfully');
      setNewAsset({
        name: '',
        category: '',
        purchaseDate: '',
        purchaseCost: '',
        condition: 'NEW',
        location: '',
        serialNumber: '',
        notes: ''
      });
      fetchAssets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add asset');
    }
  };

  const confirmDeleteAsset = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Asset',
      message: 'Are you sure you want to delete this asset? This will also delete all maintenance logs.',
      onConfirm: async () => {
        try {
          await api.delete(`/inventory/${id}`);
          toast.success('Asset deleted successfully');
          fetchAssets();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to delete asset');
        }
      }
    });
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const assetsNeedingMaintenance = assets.filter(asset => {
    if (!asset.nextMaintenanceDate) return false;
    const nextDate = new Date(asset.nextMaintenanceDate);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && asset.status === 'ACTIVE';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory & Assets</h1>
          <p className="text-muted-foreground">Track and manage school property and equipment.</p>
        </div>
        <div className="flex gap-2">
          {assetsNeedingMaintenance.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              {assetsNeedingMaintenance.length} Items Need Maintenance
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <Button 
          variant={activeTab === 'assets' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('assets')}
        >
          <Package className="w-4 h-4 mr-2" /> Assets
        </Button>
        <Button 
          variant={activeTab === 'maintenance' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('maintenance')}
        >
          <Wrench className="w-4 h-4 mr-2" /> Maintenance Due
        </Button>
      </div>

      {activeTab === 'assets' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Asset Name</label>
                  <Input 
                    placeholder="e.g. Dell Latitude 5420" 
                    value={newAsset.name} 
                    onChange={e => setNewAsset({...newAsset, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    options={categories.map(c => ({ value: c, label: c }))}
                    value={newAsset.category}
                    onChange={e => setNewAsset({...newAsset, category: e.target.value})}
                    placeholder="Select Category"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Purchase Date</label>
                  <Input 
                    type="date"
                    value={newAsset.purchaseDate} 
                    onChange={e => setNewAsset({...newAsset, purchaseDate: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Purchase Cost</label>
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    value={newAsset.purchaseCost} 
                    onChange={e => setNewAsset({...newAsset, purchaseCost: e.target.value})} 
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
                    value={newAsset.condition}
                    onChange={e => setNewAsset({...newAsset, condition: e.target.value as AssetCondition})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    placeholder="e.g. Computer Lab" 
                    value={newAsset.location} 
                    onChange={e => setNewAsset({...newAsset, location: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Serial Number</label>
                  <Input 
                    placeholder="Optional" 
                    value={newAsset.serialNumber} 
                    onChange={e => setNewAsset({...newAsset, serialNumber: e.target.value})} 
                  />
                </div>
                <Button 
                  onClick={handleAddAsset} 
                  disabled={!newAsset.name || !newAsset.category}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Asset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets by name, ID or serial..." 
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select
                options={[
                  { value: 'All', label: 'All Categories' },
                  ...categories.map(c => ({ value: c, label: c }))
                ]}
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Asset Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">Loading assets...</div>
              ) : filteredAssets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left font-medium text-muted-foreground">
                        <th className="pb-3 pr-4">ID</th>
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 pr-4">Location</th>
                        <th className="pb-3 pr-4">Condition</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredAssets.map(asset => (
                        <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs">{asset.assetId}</td>
                          <td className="py-3 pr-4 font-medium">{asset.name}</td>
                          <td className="py-3 pr-4">{asset.category}</td>
                          <td className="py-3 pr-4 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {asset.location || 'N/A'}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              asset.condition === 'NEW' ? 'bg-blue-100 text-blue-700' :
                              asset.condition === 'GOOD' ? 'bg-green-100 text-green-700' :
                              asset.condition === 'FAIR' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {asset.condition}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              asset.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                              asset.status === 'IN_REPAIR' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/inventory/assets/${asset.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Info className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => confirmDeleteAsset(asset.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No assets found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming & Overdue Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {assetsNeedingMaintenance.length > 0 ? (
              <div className="space-y-4">
                {assetsNeedingMaintenance.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/30 border-amber-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{asset.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Maintenance Due: {asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/inventory/assets/${asset.id}`}>
                      <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                        Log Maintenance
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No assets require immediate maintenance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        destructive={true}
        confirmText="Delete"
      />
    </div>
  );
}
