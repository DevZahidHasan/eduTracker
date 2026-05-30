import { Router } from 'express';
import { 
  createHomework, 
  getHomeworks, 
  getParentHomeworks, 
  updateHomework, 
  deleteHomework,
  submitHomework 
} from '../controllers/homework.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { upload, processImages } from '../middleware/upload.middleware';

const router = Router();

// Teacher and Admin can create/update/delete homework
router.post('/', authMiddleware, authorize('TEACHER', 'ADMIN'), createHomework);
router.get('/', authMiddleware, getHomeworks);
router.put('/:id', authMiddleware, authorize('TEACHER', 'ADMIN'), updateHomework);
router.delete('/:id', authMiddleware, authorize('TEACHER', 'ADMIN'), deleteHomework);

// Parent can see their child's homework and submit work
router.get('/parent', authMiddleware, authorize('PARENT'), getParentHomeworks);
router.post('/submit', authMiddleware, authorize('PARENT'), upload.array('files', 5), processImages('homework'), submitHomework);

export default router;
