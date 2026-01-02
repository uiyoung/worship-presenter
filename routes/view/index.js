import { Router } from 'express';
import { isNotLoggedIn } from '../../middlewares/auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('pages/home.njk', { title: 'Worship Presenter' });
});

router.get('/about', (req, res) => {
  res.render('pages/about.njk', { title: 'about - Worship Presenter' });
});

router.get('/auth/login', isNotLoggedIn, (req, res) => {
  res.render('pages/login.njk', { title: 'Login - Worship Presneter' });
});

router.get('/auth/signup', isNotLoggedIn, (req, res) => {
  res.render('pages/signup.njk', { title: 'Sign Up - Worship Presneter' });
});

export default router;
