import { Router } from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Admin protected routes
router.get('/', authenticateAdmin, getInventory);
router.patch('/:productId', authenticateAdmin, updateInventory);

export default router;
