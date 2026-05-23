export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'BROKEN';
export type AssetStatus = 'ACTIVE' | 'IN_REPAIR' | 'SCRAPPED' | 'DISPOSED' | 'LOST';

export interface Asset {
  id: number;
  assetId: string;
  name: string;
  category: string;
  purchaseDate?: string;
  purchaseCost?: number;
  condition: AssetCondition;
  location?: string;
  status: AssetStatus;
  serialNumber?: string;
  warrantyExpiry?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  maintenanceLogs?: AssetMaintenance[];
}

export interface AssetMaintenance {
  id: number;
  assetId: number;
  date: string;
  description: string;
  cost: number;
  performedBy?: string;
}
