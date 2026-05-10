import { Router } from 'express';
import { 
  getSchoolProfile, 
  updateSchoolProfile, 
  getSystemSettings, 
  updateSystemSettings, 
  getUsers,
  triggerEndOfDay
} from '../controllers/settings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getSchoolProfile);
router.post('/profile', updateSchoolProfile);

router.get('/system', getSystemSettings);
router.post('/system', updateSystemSettings);

router.get('/users', getUsers);

router.post('/end-of-day', triggerEndOfDay);

export default router;
