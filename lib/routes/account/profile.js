const router = require('../router')();

const general = require('./profile/general');
const password = require('./profile/password');
const emails = require('./profile/emails');
const settings = require('./profile/settings');
const image = require('./profile/image');

router.use('/general', general);
router.use('/password', password);
router.use('/emails', emails);
router.use('/settings', settings);
router.use('/image', image);

module.exports = router;
