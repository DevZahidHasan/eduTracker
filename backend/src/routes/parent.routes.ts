import { Router } from 'express';
import { getParentDashboard, getParentReportCard, getParentResults, getParentAttendance, getParentFees } from '../controllers/parent.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require the user to be logged in and have the PARENT role
router.use(authMiddleware);
router.use(authorize('PARENT'));

router.get('/dashboard', getParentDashboard);
router.get('/report/:studentId/:examType', getParentReportCard);
router.get('/results/:studentId', getParentResults);
router.get('/attendance/:studentId', getParentAttendance);
router.get('/fees/:studentId', getParentFees);

export default router;
