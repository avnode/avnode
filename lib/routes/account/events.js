const router = require('../router')();
const list = require('./events/list');

router.use('/list', list);

module.exports = router;
