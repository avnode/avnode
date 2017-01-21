const router = require('./router')();
const confirm = require('./user/confirm');

router.use('/confirm', confirm);

module.exports = router;
