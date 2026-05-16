import { Router } from 'express';
import { 
  getStudentReport, 
  getConsolidatedReport,
  exportReportCardPdf,
  exportClassReportCardsPdf,
  updateTeacherRemarks, 
  getClassPerformance, 
  getAttendanceSummary 
} from '../controllers/reports.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get('/student', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getStudentReport);
router.get('/consolidated/:studentId/:examType', authorize('ADMIN', 'PRINCIPAL'), getConsolidatedReport);
router.get('/export/:studentId/:examType', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), exportReportCardPdf);
router.get('/export-bulk/:className/:examType', authorize('ADMIN', 'PRINCIPAL'), exportClassReportCardsPdf);
router.post('/remarks', authorize('ADMIN', 'TEACHER'), updateTeacherRemarks);
router.get('/performance', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getClassPerformance);
router.get('/attendance', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getAttendanceSummary);

export default router;
