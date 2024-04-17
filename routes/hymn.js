import { Router } from 'express';
import { getHymnImagesById, updateLyrics } from '../controllers/hymn.js';
import { isLoggedIn } from '../middlewares/auth.js';

const router = Router();

router.get('/images/:no', getHymnImagesById);
router.patch('/lyrics/:no', isLoggedIn, updateLyrics);

export default router;
