import { Router } from 'express';

import authRouter from './auth.js';
import songRouter from './song.js';
import hymnRouter from './hymn.js';
import { apiLimiter, authLimiter } from '../../middlewares/rate-limit.js';

const router = Router();

router.use('/auth', authLimiter, authRouter);
router.use('/song', apiLimiter, songRouter);
router.use('/hymn', apiLimiter, hymnRouter);

export default router;
