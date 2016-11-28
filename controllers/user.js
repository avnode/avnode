const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

exports.postLogin = (req, res, next) => {
  req.assert('email', __('Email is not valid')).isEmail();
  req.assert('password', __('Password cannot be blank')).notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: __('You are logged in.') });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

exports.postProfile = (req, res, next) => {
  req.assert('email', __('Please enter a valid email address.')).isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: __('The email address you have entered is already associated with an account.') });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.redirect('/account');
    });
  });
};
