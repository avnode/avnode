const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');
const User = require('../../../models/User');
const Crew = require('../../../models/Crew');

router.get('/', (req, res) => {
  res.render('account/crews/create', {
    title: i18n.__('Crews'),
    subtitle: i18n.__('Manage your crews'),
    nav: nav,
    navkey: 'crews',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    const crew = new Crew({
      slug: _slug.parse(req.body.name),
      name: req.body.name
    });
    crew.save((err) => {
      if (err) {
        return next(err);
      }
      user.crews.push(crew);
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('New Crew has been created.') });
        res.redirect(crew.editUrl);
      });
    });
  });
});

module.exports = router;
