import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', validateObjectId, getProductById);

// Admin protected routes
router.post('/', authenticateAdmin, createProduct);
router.put('/:id', validateObjectId, authenticateAdmin, updateProduct);
router.delete('/:id', validateObjectId, authenticateAdmin, deleteProduct);

export default router;
