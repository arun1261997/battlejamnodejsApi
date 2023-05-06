import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import genreRoutes from './genre.js';
import eventRoutes from './event.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/genres', genreRoutes);
router.use('/events', eventRoutes);

export default router;
