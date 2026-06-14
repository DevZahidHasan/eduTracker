import { Router } from 'express';
import * as questionPaperController from '../controllers/questionPapers.controller';
import { validate } from '../middleware/validation.middleware';
import { authorize } from '../middleware/auth.middleware';
import { 
  createQuestionPaperSchema, 
  updateQuestionPaperSchema, 
  uuidParamSchema 
} from '../validations';

const router = Router();

router.get('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), questionPaperController.getQuestionPapers);
router.get('/templates', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), questionPaperController.getTemplates);
router.get('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), questionPaperController.getQuestionPaperById);
router.get('/:id/print', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), questionPaperController.printQuestionPaper);
router.get('/:id/export/pdf', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), questionPaperController.exportPdf);
router.post('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(createQuestionPaperSchema), questionPaperController.createQuestionPaper);
router.post('/:id/duplicate', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), questionPaperController.duplicateQuestionPaper);
router.put('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), validate(updateQuestionPaperSchema), questionPaperController.updateQuestionPaper);
router.delete('/:id', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), validate(uuidParamSchema), questionPaperController.deleteQuestionPaper);

export default router;
