const router = require('express').Router();
const { renderLogin, renderSignup, login, signup, logout } = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router.route('/login').get(isNotLoggedIn, renderLogin).post(isNotLoggedIn, login);
router.post('/logout', isLoggedIn, logout);
router.route('/signup').get(isNotLoggedIn, renderSignup).post(isNotLoggedIn, signup);
router.route('/:id').get().patch().delete();

module.exports = router;
