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
  .post(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), createInquiry)
  .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK', 'ACCOUNTANT'), getInquiries);

router
  .route('/inquiries/:id')
  .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'TEACHER', 'CLERK', 'ACCOUNTANT'), getInquiryById)
  .put(authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), updateInquiry)
  .delete(authorize('ADMIN', 'PRINCIPAL'), deleteInquiry);

// Route for converting an inquiry to an admitted student
router.post('/inquiries/:id/admit', authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK', 'ACCOUNTANT'), admitInquiry);

export default router;
