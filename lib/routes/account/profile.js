const router = require('../router')();
const nav = require('./subnav');
const countries = require('country-list')().getData();
const User = require('../../models/User');

router.get('/', (req, res) => {
  console.log(req.originalUrl);
  res.render('account/profile', {
    title: __('Account Profile'),
    path: req.originalUrl,
    nav: nav,
    countries: countries
  });
});

router.post('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.gender = req.body.gender || '';
    user.name = req.body.name || '';
    user.birthday = req.body.birthday || '';
    user.about = req.body.about || '';
    user.citizenship = req.body.citizenship || '';
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.redirect('/account/profile');
    });
  });
});

module.exports = router;
