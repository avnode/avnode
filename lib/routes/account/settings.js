const router = require('../router')();
const nav = require('./subnav');
const i18n = require('../../plugins/i18n');
const User = require('../../models/User');

router.get('/', (req, res) => {
  res.render('account/settings', {
    title: i18n.__('Account Settings'),
    nav: nav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  const slug = req.body.stagename.replace(/[^0-9a-zA-Z\-\_]/gi, '');

  User.findOne({ slug: slug }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash('errors', { msg: i18n.__('Sorry, username already exists.') });
      return res.redirect('/account/settings');
    }
    User.findById(req.user.id, (err, user) => {
      user.stagename = req.body.stagename;
      user.slug = slug;
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Profile information has been updated.') });
        res.redirect('/account/settings');
      });
    });
  });
});

module.exports = router;
