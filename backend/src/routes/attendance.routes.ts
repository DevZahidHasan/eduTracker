import { Router } from 'express';
import {
  getAttendance,
  getAttendanceById,
  bulkCreateAttendance,
  getAttendanceLockStatus,
  unlockAttendance,
} from '../controllers/attendance.controller';
import { validate } from '../middleware/validation.middleware';
import { bulkAttendanceSchema, attendanceQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.get('/lock', getAttendanceLockStatus);
router.post('/unlock', unlockAttendance);

router.get('/', validate(attendanceQuerySchema), getAttendance);
router.post('/bulk', validate(bulkAttendanceSchema), bulkCreateAttendance);
router.get('/:id', validate(idParamSchema), getAttendanceById);

export default router;
