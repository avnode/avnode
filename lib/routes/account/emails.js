const router = require('express').Router();
const nav = require('./subnav');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  res.render('account/emails', {
    title: i18n.__('Account Emails'),
    nav: nav,
    path: req.path
  });
});

router.post('/', (req, res, _next) => {
  res.redirect('/account/emails');
});

module.exports = router;
