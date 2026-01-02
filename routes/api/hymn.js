import { Router } from 'express';
import { isLoggedIn } from '../../middlewares/auth.js';
import { getHymnImagesById, updateLyrics } from '../../controllers/hymn.js';

const router = Router();

router.get('/images/:no', getHymnImagesById);
router.patch('/lyrics/:no', isLoggedIn, updateLyrics);

export default router;
