import { Router } from 'express';
import authRoutes from './auth.routes';
import configRoutes from './config.routes';
import studentsRoutes from './students.routes';
import marksRoutes from './marks.routes';
import attendanceRoutes from './attendance.routes';
import aiInsightsRoutes from './aiInsights.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require valid JWT)
router.use('/config', authMiddleware, configRoutes);
router.use('/students', authMiddleware, studentsRoutes);
router.use('/marks', authMiddleware, marksRoutes);
router.use('/attendance', authMiddleware, attendanceRoutes);
router.use('/ai-insights', authMiddleware, aiInsightsRoutes);

export default router;
