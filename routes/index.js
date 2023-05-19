const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('hi there');
});

module.exports = router;
