const router = require('./router')();

const profile = require('./account/profile');
const events = require('./account/events');
const crews = require('./account/crews');
const assets = require('./account/assets');

router.get('/profile', (req, res) => res.redirect('/account/profile/general'));
router.get('/', (req, res) => res.redirect('/account/profile/general'));
router.use('/profile', profile);

router.use('/events', events);

router.use('/crews', crews);
router.use('/assets', assets);

module.exports = router;
