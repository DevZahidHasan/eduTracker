import { Router } from 'express';
import { 
  importStudents, 
  importStaff, 
  importBooks, 
  getTemplates 
} from '../controllers/import.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

// Only Admins can import data
router.post('/students', authorize('ADMIN'), upload.single('file'), importStudents);
router.post('/staff', authorize('ADMIN'), upload.single('file'), importStaff);
router.post('/books', authorize('ADMIN'), upload.single('file'), importBooks);

// Templates are accessible to Admins
router.get('/template/:type', authorize('ADMIN'), getTemplates);

export default router;
