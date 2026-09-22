import { Router } from 'express';
import { loginAdmin, getMe, setupInitialAdmin } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', authenticateAdmin, getMe);
router.post('/setup', setupInitialAdmin);

export default router;
