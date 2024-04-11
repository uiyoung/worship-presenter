const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('pages/presenter.njk', { title: 'Worship Presenter' });
});

router.get('/about', (req, res) => {
  res.render('pages/about.njk', { title: 'about - Worship Presenter' });
});

module.exports = router;
