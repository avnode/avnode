const router = require('express').Router();
const nav = require('./subnav');
const i18n = require('../../plugins/i18n');
const User = require('../../models/User');

router.get('/', (req, res) => {
  res.render('account/password', {
    title: i18n.__('Account Password'),
    nav: nav,
    path: req.path
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
          res.redirect('/account/password');
        });
      } else {
        req.flash('errors', { msg: 'Password has not been changed.' });
        res.redirect('/account/password');
      }
    });
  });
});

module.exports = router;
