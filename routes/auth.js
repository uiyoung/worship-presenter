const router = require('express').Router();
const { renderLogin, renderSignup, login, signup, logout } = require('../controllers/auth');

router
  .route('/login')
  .get(renderLogin)
  .post((req, res, next) => {
    console.log(req.body);
    next();
  }, login);

router.route('/signup').get(renderSignup).post(signup);
router.route('/:id').get().patch().delete();

router.post('/logout', logout);

module.exports = router;
