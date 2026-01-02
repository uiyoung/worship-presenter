import { Router } from 'express';
import { isLoggedIn, isNotLoggedIn } from '../../middlewares/auth.js';
import { login, logout } from '../../controllers/auth.js';

const router = Router();

router.post('/login', isNotLoggedIn, login);
router.post('/logout', isLoggedIn, logout);

// router.route('/signup').post(isNotLoggedIn, authController.signup);
// router.route('/:id').get().patch().delete();

export default router;
