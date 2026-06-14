import { Router } from 'express';
import {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
  bulkCreateMarks,
  finalizeMarks,
  unlockMarks,
  checkMarkLock
} from '../controllers/marks.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { bulkMarksSchema, finalizeMarksSchema, lockStatusQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getMarks);
router.post('/bulk', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(bulkMarksSchema), bulkCreateMarks);
router.get('/lock-status', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(lockStatusQuerySchema), checkMarkLock);
router.post('/finalize', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(finalizeMarksSchema), finalizeMarks);
router.post('/unlock', authorize('ADMIN', 'PRINCIPAL'), validate(finalizeMarksSchema), unlockMarks);
router.get('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(idParamSchema), getMarkById);
router.post('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), createMark);
router.put('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(idParamSchema), updateMark);
router.delete('/:id', authorize('ADMIN', 'PRINCIPAL'), validate(idParamSchema), deleteMark);

export default router;
