const router = require('../../router')();
const i18n = require('../../../plugins/i18n');
const multer = require('multer');
const upload = multer({ dest: process.env.STORAGE });
const sharp = require('sharp');

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

router.post('/', upload.single('image'), (req, res, next) => {
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

    if (req.file) {
      // FIXME should be handled by a general utility
      event.image = `${req.file.filename}_s.jpeg`;
      generateImage(req.file.filename, (err, _info) => {
        if (err) {
          throw err;
        }
      });
    }

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

// FIXME replace me
const generateImage = (filename, done) => {
  sharp(`${process.env.STORAGE}${filename}`)
    .resize(1920, 400)
    .toFile(`${process.env.STORAGE}${filename}_s.jpeg`, done);
};
