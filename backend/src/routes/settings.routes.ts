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
  triggerBackup,
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

router.get('/profile', authorize('ADMIN', 'PRINCIPAL'), getSchoolProfile);
router.post('/profile', authorize('ADMIN'), updateSchoolProfile);
router.post('/profile/logo', authorize('ADMIN'), upload.single('logo'), uploadLogo);

router.get('/system', authorize('ADMIN'), getSystemSettings);
router.post('/system', authorize('ADMIN'), updateSystemSettings);

router.get('/users', authorize('ADMIN'), getUsers);
router.put('/users/:id', authorize('ADMIN'), updateUser);
router.delete('/users/:id', authorize('ADMIN'), deleteUser);

// Grade Scale
router.get('/grade-scale', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getGradeScales);
router.post('/grade-scale', authorize('ADMIN'), createGradeScale);
router.put('/grade-scale/:id', authorize('ADMIN'), updateGradeScale);
router.delete('/grade-scale/:id', authorize('ADMIN'), deleteGradeScale);

router.post('/end-of-day', authorize('ADMIN'), triggerEndOfDay);
router.post('/backup', authorize('ADMIN'), triggerBackup);

export default router;
