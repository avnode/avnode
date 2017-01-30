const router = require('./router')();

const events = require('./account/events');
const profile = require('./account/profile');

router.get('/profile', (req, res) => res.redirect('/account/profile/general'));
router.get('/', (req, res) => res.redirect('/account/profile/general'));
router.use('/profile', profile);

router.get('/events', (req, res) => res.redirect('/account/events/list'));
router.use('/events', events);

module.exports = router;
