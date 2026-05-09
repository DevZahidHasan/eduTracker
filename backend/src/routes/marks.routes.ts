import { Router } from 'express';
import {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
  bulkCreateMarks,
} from '../controllers/marks.controller';

const router = Router();

router.get('/', getMarks);
router.post('/bulk', bulkCreateMarks);
router.get('/:id', getMarkById);
router.post('/', createMark);
router.put('/:id', updateMark);
router.delete('/:id', deleteMark);

export default router;
