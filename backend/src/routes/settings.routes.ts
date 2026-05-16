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
  uploadLogo,
  getGradeScales,
  createGradeScale,
  updateGradeScale,
  deleteGradeScale
} from '../controllers/settings.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { Role } from '@prisma/client';

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

// Grade Scale
router.get('/grade-scale', getGradeScales);
router.post('/grade-scale', authorize(Role.ADMIN), createGradeScale);
router.put('/grade-scale/:id', authorize(Role.ADMIN), updateGradeScale);
router.delete('/grade-scale/:id', authorize(Role.ADMIN), deleteGradeScale);

router.post('/end-of-day', triggerEndOfDay);

export default router;
