import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  admitInquiry
} from '../controllers/admissions.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Routes for handling inquiries
router
  .route('/inquiries')
  .post(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'), createInquiry)
  .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK'), getInquiries);

router
  .route('/inquiries/:id')
  .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK'), getInquiryById)
  .put(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'), updateInquiry)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteInquiry);

// Route for converting an inquiry to an admitted student
router.post('/inquiries/:id/admit', authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'), admitInquiry);

export default router;
