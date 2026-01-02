import { Router } from 'express';

import authRouter from './auth.js';
import songRouter from './song.js';
import hymnRouter from './hymn.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/song', songRouter);
router.use('/hymn', hymnRouter);

export default router;
