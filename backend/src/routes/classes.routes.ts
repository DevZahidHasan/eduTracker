import { Router } from 'express';
import { 
  getClassesOverview, 
  getSectionDetail, 
  updateRoutine,
  getClassAnalytics,
  updateSection
} from '../controllers/classes.controller';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/overview', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'ACCOUNTANT', 'LIBRARIAN'), getClassesOverview);
router.get('/analytics', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getClassAnalytics);
router.get('/:className/:section', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF'), getSectionDetail);
router.patch('/:className/:section', authorize('ADMIN', 'PRINCIPAL'), updateSection);
router.post('/:className/:section/routine', authorize('ADMIN', 'PRINCIPAL'), updateRoutine);

export default router;
