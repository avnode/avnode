const router = require('./router')();
const i18n = require('../plugins/i18n');
const account = require('./account');
const storage = require('./storage');
const performers = require('./performers');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const fourOhFour = require('./404');

// FIXME: Add validation/security
// passportConfig.isAuthenticated, 
// for all routes beneath…
router.use('/account', account);

router.get('/', (req, res) => {
  res.render('home', {
    title: i18n.__('Welcome')
  });
});

router.use('/storage', storage);
router.use('/performers', performers);
router.use('/login', login);
router.use('/logout', logout);
router.use('/signup', signup);
router.get('/404', fourOhFour);

module.exports = router;
