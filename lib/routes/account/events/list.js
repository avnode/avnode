const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  res.render('account/events/list', {
    title: i18n.__('Events'),
    nav: nav,
    navkey: 'events',
    subnav: subnav,
    path: req.originalUrl
  });
});

module.exports = router;
