import { Router } from 'express';
import {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
} from '../controllers/marks.controller';

const router = Router();

router.get('/', getMarks);
router.get('/:id', getMarkById);
router.post('/', createMark);
router.put('/:id', updateMark);
router.delete('/:id', deleteMark);

export default router;
