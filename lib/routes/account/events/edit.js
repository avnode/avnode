const router = require('../../router')();
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');
const Event = require('../../../models/Event');

router.get('/', (req, res) => {
  Event.findOne({slug: req.params.slug}, (err, event) => {
    res.render('account/events/edit', {
      title: i18n.__('Edit Event'),
      nav: nav,
      navkey: 'events',
      subnav: subnav,
      path: req.originalUrl,
      event: event
    });
  });
});

router.post('/', (req, res, next) => {
  Event.findOne({slug: req.params.slug}, (err, event) => {
    if (err) {
      return next(err);
    }

    event.slug = _slug.parse(req.body.title);
    event.title = req.body.title;
    event.subtitle = req.body.subtitle;
    event.starts = req.body.starts;
    event.ends = req.body.ends;
    event.about = req.body.about;

    event.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Event has been updated.') });
      res.redirect(event.editUrl);
    });
  });
});

router.delete('/', (req, res, next) => {
  Event.findById(req.body._id, (err, event) => {
    if (err) {
      return next(err);
    }
    event.remove((err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;
