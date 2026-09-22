import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route for storefront settings (shipping fees, currency)
router.get('/', getSettings);

// Admin protected route for modifying store settings
router.put('/', authenticateAdmin, updateSettings);

export default router;
