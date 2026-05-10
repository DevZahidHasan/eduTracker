import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/students.controller';
import { validate } from '../middleware/validation.middleware';
import { studentSchema, studentQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.get('/', validate(studentQuerySchema), getAllStudents);
router.get('/:id', validate(idParamSchema), getStudentById);
router.post('/', validate(studentSchema), createStudent);
router.put('/:id', validate({ ...studentSchema, ...idParamSchema }), updateStudent);
router.delete('/:id', validate(idParamSchema), deleteStudent);

export default router;
