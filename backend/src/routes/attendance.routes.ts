import { Router } from 'express';
import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendance,
} from '../controllers/attendance.controller';
import { validate } from '../middleware/validation.middleware';
import { bulkAttendanceSchema, attendanceQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.get('/', validate(attendanceQuerySchema), getAttendance);
router.post('/bulk', validate(bulkAttendanceSchema), bulkCreateAttendance);
router.get('/:id', validate(idParamSchema), getAttendanceById);
router.post('/', createAttendance);
router.put('/:id', validate(idParamSchema), updateAttendance);
router.delete('/:id', validate(idParamSchema), deleteAttendance);

export default router;
