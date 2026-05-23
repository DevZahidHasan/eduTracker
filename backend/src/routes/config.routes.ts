import { Router } from 'express';
import { getConfig, createClass, createSection, createSubject, createExamType, updateExamType } from '../controllers/config.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res, next) => {
  console.log('Public config route hit');
  next();
}, getConfig);

// Protected administration routes
router.use(authMiddleware);
router.post('/classes', createClass);
router.post('/sections', createSection);
router.post('/subjects', createSubject);
router.post('/exam-types', createExamType);
router.patch('/exam-types/:name', updateExamType);

export default router;
