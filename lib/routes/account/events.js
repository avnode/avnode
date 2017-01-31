const router = require('../router')();
const list = require('./events/list');
const create = require('./events/create');
const edit = require('./events/edit');

router.use('/create', create);
router.use('/:slug', edit);
router.use('/', list);

module.exports = router;
