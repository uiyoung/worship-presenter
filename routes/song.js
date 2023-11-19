const router = require('express').Router();
const {
  getSongById,
  getSongs,
  createSong,
  updateSong,
  deleteSong,
} = require('../controllers/song');
const { isLoggedIn } = require('../middlewares/');

router
  .route('/:id')
  .get(getSongById)
  .patch(isLoggedIn, updateSong)
  .delete(isLoggedIn, deleteSong);

router //
  .route('/')
  .get(getSongs)
  .post(isLoggedIn, createSong);

module.exports = router;
