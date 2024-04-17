import { Router } from 'express';
import { renderLogin, login, logout } from '../controllers/auth.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth.js';

const router = Router();

router
  .route('/login')
  .get(isNotLoggedIn, renderLogin)
  .post(isNotLoggedIn, login);

router.post('/logout', isLoggedIn, logout);

//router.route('/signup').get(isNotLoggedIn, authController.renderSignup).post(isNotLoggedIn, authController.signup);
// router.route('/:id').get().patch().delete();

export default router;
