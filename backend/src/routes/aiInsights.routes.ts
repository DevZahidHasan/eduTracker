import { Router } from 'express';
import { getInsights, generateQuestions } from '../controllers/aiInsights.controller';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), getInsights);
router.post('/generate-questions', authorize('ADMIN', 'PRINCIPAL', 'TEACHER'), generateQuestions);

export default router;
