const router = require('../../router')();

const i18n = require('../../../plugins/i18n');
const User = require('../../../models/User');
const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');

router.get('/', (req, res) => {
  res.render('account/profile/settings', {
    title: i18n.__('Account Settings'),
    nav: nav,
    navkey: 'profile',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  const slug = _slug.parse(req.body.stagename);

  User.findOne({ slug: slug }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash('errors', { msg: i18n.__('Sorry, stagename already exists.') });
      return res.redirect('/account/profile/settings');
    }
    User.findById(req.user.id, (err, user) => {
      user.stagename = req.body.stagename;
      user.slug = slug;
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Profile information has been updated.') });
        res.redirect('/account/profile/settings');
      });
    });
  });
});

module.exports = router;
