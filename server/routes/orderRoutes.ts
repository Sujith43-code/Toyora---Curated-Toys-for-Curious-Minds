import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderTracking,
} from '../controllers/orderController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route for customer order checkout
router.post('/', createOrder);

// Admin protected routes
router.get('/', authenticateAdmin, getOrders);
router.get('/:id', validateObjectId, authenticateAdmin, getOrderById);
router.put('/:id/status', validateObjectId, authenticateAdmin, updateOrderStatus);
router.put('/:id/tracking', validateObjectId, authenticateAdmin, updateOrderTracking);

export default router;
