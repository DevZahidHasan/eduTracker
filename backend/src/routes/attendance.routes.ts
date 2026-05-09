import { Router } from 'express';
import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendance,
} from '../controllers/attendance.controller';

const router = Router();

router.get('/', getAttendance);
router.post('/bulk', bulkCreateAttendance);
router.get('/:id', getAttendanceById);
router.post('/', createAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
