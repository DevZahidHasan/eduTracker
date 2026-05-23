import { Router } from 'express';
import { 
  getTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate, 
  generateIDCards, 
  generateCertificate 
} from '../controllers/document.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Template Routes
router.get('/templates', getTemplates);
router.post('/templates', authorize('ADMIN', 'PRINCIPAL'), createTemplate);
router.put('/templates/:id', authorize('ADMIN', 'PRINCIPAL'), updateTemplate);
router.delete('/templates/:id', authorize('ADMIN', 'PRINCIPAL'), deleteTemplate);

// Generation Routes
router.post('/generate/id-cards', authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'ACCOUNTANT'), generateIDCards);
router.post('/generate/certificate', authorize('ADMIN', 'PRINCIPAL', 'STAFF', 'CLERK'), generateCertificate);

export default router;
