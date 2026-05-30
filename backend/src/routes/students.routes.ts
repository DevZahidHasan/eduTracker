import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadStudentPhoto,
  generateStudentCredentials,
  linkParentToStudent
} from '../controllers/students.controller';
import { validate } from '../middleware/validation.middleware';
import { studentSchema, studentQuerySchema, idParamSchema } from '../validations';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/generate-credentials', generateStudentCredentials);
router.post('/upload-photo', upload.single('student-photo'), uploadStudentPhoto);
router.get('/', validate(studentQuerySchema), getAllStudents);
router.get('/:id', validate(idParamSchema), getStudentById);
router.post('/', validate(studentSchema), createStudent);
router.put('/:id', validate({ ...studentSchema, ...idParamSchema }), updateStudent);
router.delete('/:id', validate(idParamSchema), deleteStudent);
router.post('/:id/link-parent', validate(idParamSchema), linkParentToStudent);

export default router;
