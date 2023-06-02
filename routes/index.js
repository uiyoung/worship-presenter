const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('song-list', { title: 'Worship Presenter' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'about - Worship Presenter' });
});
module.exports = router;
