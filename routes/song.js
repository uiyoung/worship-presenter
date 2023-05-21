const router = require('express').Router();
const {
  getTotalCount,
  getSongs,
  getSongById,
  addSong,
  renderSongForm,
  renderSongList,
} = require('../controllers/song');

router.get('/list', renderSongList);
router.get('/new', renderSongForm);
router.get('/count', getTotalCount);
router.route('/:id').get(getSongById).patch().delete();
router.route('/').get(getSongs).post(addSong);

module.exports = router;
