import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', validateObjectId, getCategoryById);

// Admin protected routes
router.post('/', authenticateAdmin, createCategory);
router.put('/:id', validateObjectId, authenticateAdmin, updateCategory);
router.delete('/:id', validateObjectId, authenticateAdmin, deleteCategory);

export default router;
