import { Router } from 'express';
import { getInsights, generateQuestions } from '../controllers/aiInsights.controller';

const router = Router();

router.post('/', getInsights);
router.post('/generate-questions', generateQuestions);

export default router;
