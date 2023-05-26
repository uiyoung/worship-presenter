const router = require('express').Router();
const { renderLogin } = require('../controllers/auth');

router.get('/login', renderLogin);

router.get('/another-route', (req, res) => {
  // router code here
});

module.exports = router;
