import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only Admins should be able to see audit logs
router.get('/', authMiddleware, authorize('ADMIN'), getAuditLogs);

export default router;
