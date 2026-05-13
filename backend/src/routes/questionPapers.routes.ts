import { Router } from 'express';
import * as questionPaperController from '../controllers/questionPapers.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  createQuestionPaperSchema, 
  updateQuestionPaperSchema, 
  uuidParamSchema 
} from '../validations';

const router = Router();

router.get('/', questionPaperController.getQuestionPapers);
router.get('/:id', validate(uuidParamSchema), questionPaperController.getQuestionPaperById);
router.post('/', validate(createQuestionPaperSchema), questionPaperController.createQuestionPaper);
router.put('/:id', validate(uuidParamSchema), validate(updateQuestionPaperSchema), questionPaperController.updateQuestionPaper);
router.delete('/:id', validate(uuidParamSchema), questionPaperController.deleteQuestionPaper);

export default router;
