import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';
import inventoryRoutes from './inventoryRoutes';
import reviewRoutes from './reviewRoutes';
import customerRoutes from './customerRoutes';
import settingsRoutes from './settingsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/customers', customerRoutes);
router.use('/settings', settingsRoutes);

export default router;
