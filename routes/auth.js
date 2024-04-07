const router = require('express').Router();
const authController = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router
  .route('/login')
  .get(isNotLoggedIn, authController.renderLogin)
  .post(isNotLoggedIn, authController.login);

router.post('/logout', isLoggedIn, authController.logout);

//router.route('/signup').get(isNotLoggedIn, authController.renderSignup).post(isNotLoggedIn, authController.signup);

router.route('/:id').get().patch().delete();

module.exports = router;
