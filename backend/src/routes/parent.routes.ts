import { Router } from 'express';
import { getParentDashboard } from '../controllers/parent.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require the user to be logged in and have the PARENT role
router.use(authMiddleware);
router.use(authorize('PARENT'));

router.get('/dashboard', getParentDashboard);

export default router;
