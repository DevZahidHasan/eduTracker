import { Router } from 'express';
import { 
  getAssets, 
  getAssetById,
  createAsset, 
  updateAsset, 
  deleteAsset, 
  getAssetMaintenance, 
  createAssetMaintenance, 
  deleteAssetMaintenance 
} from '../controllers/inventory.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(authMiddleware);

// Asset Routes
router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), createAsset);
router.patch('/:id', authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), updateAsset);
router.delete('/:id', authorize('ADMIN'), deleteAsset);

// Maintenance Routes
router.get('/:assetId/maintenance', getAssetMaintenance);
router.post('/maintenance', authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'ACCOUNTANT'), createAssetMaintenance);
router.delete('/maintenance/:id', authorize('ADMIN'), deleteAssetMaintenance);

export default router;
