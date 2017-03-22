const router = require('./router')();

const api = require('./account/api');
const index = require('./account/index');

router.use('/api', api);
router.use('/profile', index);

module.exports = router;
