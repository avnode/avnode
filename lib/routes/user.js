const router = require('express').Router();
const confirm = require('./user/confirm');

router.use('/confirm', confirm);

module.exports = router;
