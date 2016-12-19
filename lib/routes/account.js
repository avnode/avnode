const router = require('express').Router();
const profile = require('./account/profile');
const password = require('./account/password');
const emails = require('./account/emails');
const settings = require('./account/settings');
const image = require('./account/image');

router.get('/', (req, res) => res.redirect('/account/profile'));
router.use('/profile', profile);
router.use('/password', password);
router.use('/emails', emails);
router.use('/settings', settings);
router.use('/image', image);

module.exports = router;
