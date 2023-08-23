const router = require('express').Router();
const songController = require('../controllers/song');
const { isLoggedIn } = require('../middlewares/');

router
  .route('/:id')
  .get(songController.getSongById)
  .patch(isLoggedIn, songController.updateSong)
  .delete(isLoggedIn, songController.deleteSong);

router //
  .route('/')
  .get(songController.getSongs)
  .post(isLoggedIn, songController.createSong);

module.exports = router;
