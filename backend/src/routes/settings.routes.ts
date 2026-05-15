import { Router } from 'express';
import { 
  getSchoolProfile, 
  updateSchoolProfile, 
  getSystemSettings, 
  updateSystemSettings, 
  getUsers,
  updateUser,
  deleteUser,
  triggerEndOfDay,
  uploadLogo
} from '../controllers/settings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getSchoolProfile);
router.post('/profile', updateSchoolProfile);
router.post('/profile/logo', upload.single('logo'), uploadLogo);

router.get('/system', getSystemSettings);
router.post('/system', updateSystemSettings);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/end-of-day', triggerEndOfDay);

export default router;
