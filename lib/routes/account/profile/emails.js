const router = require('../../router')();
const uuid = require('uuid');

const i18n = require('../../../plugins/i18n');
const mailer = require('../../../utilities/mailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  res.render('account/profile/emails', {
    title: __('Your Profile'),
    subtitle: __('Manage your account'),
    nav: nav,
    navkey: 'profile',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  const newEmail = req.body.newEmail;
  const confirm = uuid.v4();
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.emails.push({
      email: newEmail,
      confirm: confirm
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      mailer.confirmEmail({ to: newEmail }, { confirm: confirm }, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: i18n.__('Please check your inbox and confirm your Email') });
        res.redirect('/account/profile/emails');
      });
    });
  });
});

router.put('/primary', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.emails.forEach(function(email) {
      if (email.email === req.body.email && email.is_confirmed === true) {
        email.is_primary = true;
      } else {
        email.is_primary = false;
      }
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.sendStatus(200);
    });
  });
});

router.put('/public', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.emails.forEach(function(email) {
      if (email.email === req.body.email) {
        email.is_public = true;
      }
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.sendStatus(200);
    }); });
});

router.put('/private', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.emails.forEach(function(email) {
      if (email.email === req.body.email) {
        email.is_public = false;
      }
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.sendStatus(200);
    }); });
});

router.delete('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    user.emails.forEach(function(email, i) {
      if (email.email === req.body.email && email.is_primary === false) {
        user.emails.splice(i, 1);
      }
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.sendStatus(200);
    });
  });
});

module.exports = router;
