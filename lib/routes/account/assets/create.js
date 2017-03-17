const _ = require('lodash');
const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');
const User = require('../../../models/User');

const assetUtil = require('../../../utilities/asset');

router.get('/', (req, res) => {
  res.render('account/assets/create', {
    title: 'Assets',
    subtitle: 'Manage your crews',
    nav: nav,
    navkey: 'assets',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  if (req.body.url) {
    assetUtil.create('video', req.body.url, req.user, (err, asset) => {
      if (err) {
        throw err;
      }
      res.redirect('/account/assets');
    });
  }
});

module.exports = router;
