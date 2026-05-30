import { Router } from 'express';
import { getParentDashboard, getParentReportCard, getParentResults } from '../controllers/parent.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require the user to be logged in and have the PARENT role
router.use(authMiddleware);
router.use(authorize('PARENT'));

router.get('/dashboard', getParentDashboard);
router.get('/report/:studentId/:examType', getParentReportCard);
router.get('/results/:studentId', getParentResults);

export default router;
