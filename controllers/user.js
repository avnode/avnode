const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const countries = require('country-list')().getData();
const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: __('Login')
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

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('account/signup', {
    title: __('Create Account')
  });
};

exports.postSignup = (req, res, next) => {
  req.assert('email', __('Email is not valid')).isEmail();
  req.assert('password', __('Use at least eight characters')).len(8);
  req.assert('confirmPassword', __('Passwords do not match')).equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: __('Account already exists.') });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getAccount = (req, res) => {
  res.redirect('/account/profile');
};

exports.getProfile = (req, res) => {
  res.render('account/profile', {
    title: __('Account Profile'),
    countries: countries
  });
};
exports.postProfile = (req, res, next) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account/profile');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.profile.name = req.body.name || '';
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.redirect('/account/profile');
    });
  });
};

exports.getPassword = (req, res) => {
  res.render('account/password', {
    title: __('Account Password')
  });
};
exports.postPassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account/password');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account/password');
    });
  });
};

exports.getEmails = (req, res) => {
  res.render('account/emails', {
    title: __('Account Emails')
  });
};
exports.postEmails = (req, res, next) => {
  res.redirect('/account/emails');
};

exports.getSettings = (req, res) => {
  res.render('account/settings', {
    title: __('Account Settings')
  });
};
exports.postSettings = (req, res, next) => {
  req.assert('stagename', __('Please use only alphanumeric characters.')).isAlphanumeric();
  res.redirect('/account/settings');
};
