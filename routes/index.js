import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('pages/presenter.njk', { title: 'Worship Presenter' });
});

router.get('/about', (req, res) => {
  res.render('pages/about.njk', { title: 'about - Worship Presenter' });
});

export default router;
