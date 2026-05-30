import { Router } from 'express';
import { 
  createHomework, 
  getHomeworks, 
  getParentHomeworks, 
  updateHomework, 
  deleteHomework 
} from '../controllers/homework.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// Teacher and Admin can create/update/delete homework
router.post('/', authMiddleware, authorize('TEACHER', 'ADMIN'), createHomework);
router.get('/', authMiddleware, getHomeworks);
router.put('/:id', authMiddleware, authorize('TEACHER', 'ADMIN'), updateHomework);
router.delete('/:id', authMiddleware, authorize('TEACHER', 'ADMIN'), deleteHomework);

// Parent can see their child's homework
router.get('/parent', authMiddleware, authorize('PARENT'), getParentHomeworks);

export default router;
