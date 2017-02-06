const router = require('../../router')();

const i18n = require('../../../plugins/i18n');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  res.render('account/profile/password', {
    title: i18n.__('Your Profile'),
    subtitle: i18n.__('Manage your account'),
    nav: nav,
    navkey: 'profile',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) { return next(err); }
      if (isMatch) {
        user.password = req.body.newPassword;
        user.save((err) => {
          if (err) { return next(err); }
          req.flash('success', { msg: 'Password has been changed.' });
          res.redirect('/account/profile/password');
        });
      } else {
        req.flash('errors', { msg: 'Password has not been changed.' });
        res.redirect('/account/profile/password');
      }
    });
  });
});

module.exports = router;
