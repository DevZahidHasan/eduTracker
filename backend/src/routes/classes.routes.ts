import { Router } from 'express';
import { 
  getClassesOverview, 
  getSectionDetail, 
  updateRoutine,
  getClassAnalytics,
  updateSection
} from '../controllers/classes.controller';

const router = Router();

router.get('/overview', getClassesOverview);
router.get('/analytics', getClassAnalytics);
router.get('/:className/:section', getSectionDetail);
router.patch('/:className/:section', updateSection);
router.post('/:className/:section/routine', updateRoutine);

export default router;
