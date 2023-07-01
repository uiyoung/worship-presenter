const router = require('express').Router();
const { getHymnImagesById } = require('../controllers/hymn');

router.get('/images/:no', getHymnImagesById);

module.exports = router;
