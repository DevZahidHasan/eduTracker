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
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/student', getStudentReport);
router.get('/consolidated/:studentId/:examType', getConsolidatedReport);
router.get('/export/:studentId/:examType', exportReportCardPdf);
router.get('/export-bulk/:className/:examType', exportClassReportCardsPdf);
router.post('/remarks', updateTeacherRemarks);
router.get('/performance', getClassPerformance);
router.get('/attendance', getAttendanceSummary);

export default router;
