import { Router } from 'express';
import {
  getAttendance,
  getAttendanceById,
  bulkCreateAttendance,
  getAttendanceLockStatus,
  unlockAttendance,
} from '../controllers/attendance.controller';
import { validate } from '../middleware/validation.middleware';
import { authorize } from '../middleware/auth.middleware';
import { bulkAttendanceSchema, attendanceQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.get('/lock', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF'), getAttendanceLockStatus);
router.post('/unlock', authorize('ADMIN', 'PRINCIPAL'), unlockAttendance);

router.get('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'ACCOUNTANT'), validate(attendanceQuerySchema), getAttendance);
router.post('/bulk', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF'), validate(bulkAttendanceSchema), bulkCreateAttendance);
router.get('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF'), validate(idParamSchema), getAttendanceById);

export default router;
