const router = require('express').Router();
const { getHymnImagesById, updateLyrics } = require('../controllers/hymn');
const { isLoggedIn } = require('../middlewares/');

router.get('/images/:no', getHymnImagesById);
router.patch('/lyrics/:no', isLoggedIn, updateLyrics);

module.exports = router;
