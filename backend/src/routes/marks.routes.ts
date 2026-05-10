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

const router = Router();

router.use(authMiddleware);

router.get('/', getMarks);
router.post('/bulk', bulkCreateMarks);
router.get('/lock-status', checkMarkLock);
router.post('/finalize', finalizeMarks);
router.post('/unlock', unlockMarks);
router.get('/:id', getMarkById);
router.post('/', createMark);
router.put('/:id', updateMark);
router.delete('/:id', deleteMark);

export default router;
