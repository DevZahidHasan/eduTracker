import { Router } from 'express';
import * as questionBankController from '../controllers/questionBank.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get('/', questionBankController.getBankQuestions);
router.get('/:id', questionBankController.getBankQuestionById);

// Only ADMIN and TEACHER can manage bank questions
router.use(authorize(Role.ADMIN, Role.TEACHER));

router.post('/', questionBankController.createBankQuestion);
router.put('/:id', questionBankController.updateBankQuestion);
router.delete('/:id', questionBankController.deleteBankQuestion);

export default router;
