import { Router } from 'express';
import { 
  getStudentReport, 
  getConsolidatedReport,
  exportReportCardPdf,
  exportClassReportCardsPdf,
  updateTeacherRemarks, 
  getClassPerformance, 
  getAttendanceSummary,
  generateAnnualResult
} from '../controllers/reports.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/student', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), getStudentReport);
router.get('/consolidated/:studentId/:examType', authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), getConsolidatedReport);
router.get('/export/:studentId/:examType', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), exportReportCardPdf);
router.get('/export-bulk/:className/:examType', authorize('ADMIN', 'PRINCIPAL', 'ACCOUNTANT'), exportClassReportCardsPdf);
router.post('/remarks', authorize('ADMIN', 'TEACHER'), updateTeacherRemarks);
router.get('/performance', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), getClassPerformance);
router.get('/attendance', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT'), getAttendanceSummary);
router.post('/annual-result/:studentId', authorize('ADMIN', 'PRINCIPAL'), generateAnnualResult);

export default router;
