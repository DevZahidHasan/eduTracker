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
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { bulkMarksSchema, finalizeMarksSchema, lockStatusQuerySchema, idParamSchema } from '../validations';

const router = Router();

router.use(authMiddleware);

router.get('/', getMarks);
router.post('/bulk', validate(bulkMarksSchema), bulkCreateMarks);
router.get('/lock-status', validate(lockStatusQuerySchema), checkMarkLock);
router.post('/finalize', validate(finalizeMarksSchema), finalizeMarks);
router.post('/unlock', validate(finalizeMarksSchema), unlockMarks);
router.get('/:id', validate(idParamSchema), getMarkById);
router.post('/', createMark);
router.put('/:id', validate(idParamSchema), updateMark);
router.delete('/:id', validate(idParamSchema), deleteMark);

export default router;
