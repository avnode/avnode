const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

router.get('/', (req, res) => {
  res.render('account/events/create', {
    title: i18n.__('Events'),
    subtitle: i18n.__('Manage your events'),
    nav: nav,
    navkey: 'events',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    const event = new Event({
      slug: _slug.parse(req.body.title),
      title: req.body.title
    });
    event.save((err) => {
      if (err) {
        return next(err);
      }
      user.events.push(event);
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('New Event has been created.') });
        res.redirect(event.editUrl);
      });
    });
  });
});

module.exports = router;
