import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadStudentPhoto,
  generateStudentCredentials
} from '../controllers/students.controller';
import { validate } from '../middleware/validation.middleware';
import { authorize } from '../middleware/auth.middleware';
import { studentSchema, studentQuerySchema, idParamSchema } from '../validations';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/generate-credentials', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), generateStudentCredentials);
router.post('/upload-photo', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), upload.single('student-photo'), uploadStudentPhoto);
router.get('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'ACCOUNTANT', 'LIBRARIAN'), validate(studentQuerySchema), getAllStudents);
router.get('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'ACCOUNTANT', 'LIBRARIAN'), validate(idParamSchema), getStudentById);
router.post('/', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), validate(studentSchema), createStudent);
router.put('/:id', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), validate({ ...studentSchema, ...idParamSchema }), updateStudent);
router.delete('/:id', authorize('ADMIN', 'PRINCIPAL'), validate(idParamSchema), deleteStudent);

export default router;
