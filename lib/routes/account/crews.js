const router = require('../router')();
const list = require('./crews/list');
const create = require('./crews/create');
const edit = require('./crews/edit');

router.use('/create', create);
router.use('/:slug', edit);
router.use('/', list);

module.exports = router;
