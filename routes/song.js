const router = require('express').Router();
const { getAllSongs, renderSongFom, renderSongList } = require('../controllers/song');

router.route('/').get(getAllSongs);
router.get('/list', renderSongList);
router.get('/new', renderSongFom);

router.route('/:id').get().post().patch().delete();
module.exports = router;
