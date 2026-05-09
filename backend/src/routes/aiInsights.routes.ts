import { Router } from 'express';
import { getInsights } from '../controllers/aiInsights.controller';

const router = Router();

router.post('/', getInsights);

export default router;
