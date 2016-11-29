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

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: __('Account Management')
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

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
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
