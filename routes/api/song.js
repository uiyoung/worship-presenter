import { Router } from 'express';
import { isLoggedIn } from '../../middlewares/auth.js';
import { getSongById, getSongs, createSong, updateSong, deleteSong } from '../../controllers/song.js';

const router = Router();

router //
  .route('/:id')
  .get(getSongById)
  .patch(isLoggedIn, updateSong)
  .delete(isLoggedIn, deleteSong);

router //
  .route('/')
  .get(getSongs)
  .post(isLoggedIn, createSong);

export default router;
