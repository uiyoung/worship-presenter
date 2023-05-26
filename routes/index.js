const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('song-list', { title: 'Worship Presenter' });
});

module.exports = router;
