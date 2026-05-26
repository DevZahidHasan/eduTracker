import { Router } from 'express';
import { getLicenseStatus, updateLicense } from '../controllers/license.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Allow checking status and updating without full license, but updating requires admin auth
router.get('/status', getLicenseStatus);
router.post('/update', authMiddleware, updateLicense);

export default router;
