const router = require('express').Router();
const { renderLogin, renderSignup, login, signup, logout } = require('../controllers/auth');

router.route('/login').get(renderLogin).post(login);
router.post('/logout', logout);
router.route('/signup').get(renderSignup).post(signup);
router.route('/:id').get().patch().delete();

module.exports = router;
