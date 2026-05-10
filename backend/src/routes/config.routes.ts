import { Router } from 'express';
import { getConfig, createClass, createSubject, createExamType } from '../controllers/config.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getConfig);

// Protected administration routes
router.use(authMiddleware);
router.post('/classes', createClass);
router.post('/subjects', createSubject);
router.post('/exam-types', createExamType);

export default router;
