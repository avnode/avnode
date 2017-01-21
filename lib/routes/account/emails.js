const router = require('../router')();
const nav = require('./subnav');
const i18n = require('../../plugins/i18n');
const User = require('../../models/User');

router.get('/', (req, res) => {
  res.render('account/emails', {
    title: i18n.__('Account Emails'),
    nav: nav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    user.emails.push({
      email: req.body.newEmail
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.redirect('/account/emails');
    });
  });
});

module.exports = router;
