import { Router } from 'express';
import authRoutes from './auth.routes';
import configRoutes from './config.routes';
import studentsRoutes from './students.routes';
import marksRoutes from './marks.routes';
import attendanceRoutes from './attendance.routes';
import aiInsightsRoutes from './aiInsights.routes';
import classesRoutes from './classes.routes';
import reportsRoutes from './reports.routes';
import settingsRoutes from './settings.routes';
import auditRoutes from './audit.routes';
import usersRoutes from './users.routes';
import notificationRoutes from './notifications.routes';
import questionPapersRoutes from './questionPapers.routes';
import questionBankRoutes from './questionBank.routes';
import financeRoutes from './finance.routes';
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
router.use('/classes', authMiddleware, classesRoutes);
router.use('/reports', authMiddleware, reportsRoutes);
router.use('/settings', authMiddleware, settingsRoutes);
router.use('/audit', authMiddleware, auditRoutes);
router.use('/users', authMiddleware, usersRoutes);
router.use('/notifications', authMiddleware, notificationRoutes);
router.use('/question-papers', authMiddleware, questionPapersRoutes);
router.use('/question-bank', authMiddleware, questionBankRoutes);
router.use('/finance', authMiddleware, financeRoutes);

export default router;
