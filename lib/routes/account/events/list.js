const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');
const User = require('../../../models/User');

router.get('/', (req, res, next) => {
  User
  .findById(req.user.id)
  .populate('events')
  .exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.render('account/events/list', {
      title: i18n.__('Events'),
      subtitle: i18n.__('Manage your events'),
      nav: nav,
      navkey: 'events',
      subnav: subnav,
      path: req.originalUrl,
      user: user
    });
  });
});

module.exports = router;
