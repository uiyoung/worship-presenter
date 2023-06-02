const router = require('express').Router();
const {
  getTotalCount,
  getSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong,
  renderSongForm,
} = require('../controllers/song');
const { isLoggedIn } = require('../middlewares/');

router.get('/new', renderSongForm);
router.get('/count', getTotalCount);
router.route('/:id').get(getSongById).patch(isLoggedIn, updateSong).delete(isLoggedIn, deleteSong);
router.route('/').get(getSongs).post(isLoggedIn, addSong);

module.exports = router;
