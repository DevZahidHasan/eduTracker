import api from '@/lib/api';
import { Asset, AssetMaintenance } from '@/types/inventory';

export const inventoryService = {
  getAssets: async () => {
    const response = await api.get<{ data: Asset[] }>('/inventory');
    return response.data.data;
  },

  getAssetById: async (id: number) => {
    const response = await api.get<{ data: Asset }>(`/inventory/${id}`);
    return response.data.data;
  },

  createAsset: async (data: Partial<Asset>) => {
    const response = await api.post<{ data: Asset }>('/inventory', data);
    return response.data.data;
  },

  updateAsset: async (id: number, data: Partial<Asset>) => {
    const response = await api.patch<{ data: Asset }>(`/inventory/${id}`, data);
    return response.data.data;
  },

  deleteAsset: async (id: number) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  getAssetMaintenance: async (assetId: number) => {
    const response = await api.get<{ data: AssetMaintenance[] }>(`/inventory/${assetId}/maintenance`);
    return response.data.data;
  },

  createAssetMaintenance: async (data: Partial<AssetMaintenance> & { nextMaintenanceDate?: string }) => {
    const response = await api.post<{ data: AssetMaintenance }>('/inventory/maintenance', data);
    return response.data.data;
  },

  deleteAssetMaintenance: async (id: number) => {
    const response = await api.delete(`/inventory/maintenance/${id}`);
    return response.data;
  }
};
