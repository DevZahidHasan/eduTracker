import { Router } from 'express';
import { 
  getConfig, 
  createClass, 
  createSection, 
  createSubject, 
  createExamType, 
  updateExamType,
  deleteClass,
  deleteSection,
  deleteSubject,
  deleteExamType
} from '../controllers/config.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res, next) => {
  next();
}, getConfig);

// Protected administration routes
router.use(authMiddleware);
router.post('/classes', authorize('ADMIN'), createClass);
router.delete('/classes/:name', authorize('ADMIN'), deleteClass);

router.post('/sections', authorize('ADMIN'), createSection);
router.delete('/sections/:className/:section', authorize('ADMIN'), deleteSection);

router.post('/subjects', authorize('ADMIN'), createSubject);
router.delete('/subjects/:name', authorize('ADMIN'), deleteSubject);

router.post('/exam-types', authorize('ADMIN'), createExamType);
router.patch('/exam-types/:name', authorize('ADMIN'), updateExamType);
router.delete('/exam-types/:name', authorize('ADMIN'), deleteExamType);

export default router;
