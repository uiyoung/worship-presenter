const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('presenter', { title: 'Worship Presenter' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'about - Worship Presenter' });
});
module.exports = router;
