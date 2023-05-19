const router = require('express').Router();
const { getAllSongs, getSongById, addSong, renderSongForm, renderSongList } = require('../controllers/song');

router.route('/').get(getAllSongs).post(addSong);
router.get('/list', renderSongList);
router.get('/new', renderSongForm);

router.route('/:id').get(getSongById).patch().delete();
module.exports = router;
