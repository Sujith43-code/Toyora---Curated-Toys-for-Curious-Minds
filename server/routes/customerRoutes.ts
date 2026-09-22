import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Admin protected routes
router.get('/', authenticateAdmin, getCustomers);
router.get('/:id', validateObjectId, authenticateAdmin, getCustomerById);

export default router;
