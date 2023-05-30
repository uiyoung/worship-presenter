const router = require('express').Router();
const { getTotalCount, getSongs, getSongById, addSong, renderSongForm } = require('../controllers/song');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/');

router.get('/new', renderSongForm);
router.get('/count', getTotalCount);
router.route('/:id').get(getSongById).patch().delete();
router.route('/').get(getSongs).post(isLoggedIn, addSong);

module.exports = router;
