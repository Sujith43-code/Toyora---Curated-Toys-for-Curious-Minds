import { Router } from 'express';
import {
  getReviews,
  getProductReviews,
  createReview,
  updateReviewModeration,
  deleteReview,
} from '../controllers/reviewController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes for customers
router.get('/product/:productId', getProductReviews);
router.post('/', createReview);

// Admin protected routes for moderation
router.get('/', authenticateAdmin, getReviews);
router.patch('/:id/moderation', validateObjectId, authenticateAdmin, updateReviewModeration);
router.delete('/:id', validateObjectId, authenticateAdmin, deleteReview);

export default router;
