const router = require('express').Router();
const {
  getTotalSongCount,
  getSongs,
  getSongById,
  addSong,
  renderSongForm,
  renderSongList,
} = require('../controllers/song');

router.get('/list', renderSongList);
router.get('/count', getTotalSongCount);
router.get('/new', renderSongForm);
router.route('/:id').get(getSongById).patch().delete();
router.route('/').get(getSongs).post(addSong);

module.exports = router;
