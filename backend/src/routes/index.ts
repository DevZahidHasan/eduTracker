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
import libraryRoutes from './library.routes';
import transportRoutes from './transport.routes';
import admissionsRoutes from './admissions.routes';
import hrRoutes from './hr.routes';
import inventoryRoutes from './inventory.routes';
import documentRoutes from './document.routes';
import licenseRoutes from './license.routes';
import { authMiddleware } from '../middleware/auth.middleware';
import { licenseCheckMiddleware } from '../middleware/license.middleware';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/license', licenseRoutes); // License checking and updating

// Enforce valid license for all subsequent (protected) routes
router.use(licenseCheckMiddleware);

// Protected routes (require valid JWT and valid License)
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
router.use('/library', authMiddleware, libraryRoutes);
router.use('/transport', authMiddleware, transportRoutes);
router.use('/admissions', authMiddleware, admissionsRoutes);
router.use('/hr', authMiddleware, hrRoutes);
router.use('/inventory', authMiddleware, inventoryRoutes);
router.use('/documents', authMiddleware, documentRoutes);

export default router;
