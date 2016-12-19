const router = require('express').Router();

router.post('/', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
