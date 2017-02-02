const router = require('../../router')();
const i18n = require('../../../plugins/i18n');
const multer = require('multer');
const upload = multer({ dest: process.env.STORAGE });

const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');
const Crew = require('../../../models/Crew');
const User = require('../../../models/User');

router.get('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    Crew.findOne({ slug: req.params.slug }, (err, crew) => {
      if (err) {
        return next(err);
      }
      User.find({ crews: { $in: [crew._id] } }, (err, members) => {
        res.render('account/crews/edit', {
          title: i18n.__('Crew'),
          subtitle: i18n.__('Manage your crews'),
          nav: nav,
          navkey: 'crews',
          subnav: subnav,
          path: req.originalUrl,
          user: user,
          members: members,
          crew: crew
        });
      });
    });
  });
});

router.post('/', upload.single('image'), (req, res, next) => {
  Crew.findOne({slug: req.params.slug}, (err, crew) => {
    if (err) {
      return next(err);
    }
    crew.slug = _slug.parse(req.body.name);
    crew.name = req.body.name;
    crew.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Crew has been updated.') });
      res.redirect(crew.editUrl);
    });
  });
});

router.delete('/members/:id', (req, res, next) => {
  Crew.findOne({ slug: req.params.slug }, (err, crew) => {
    User.findById(req.params.id, (err, user) => {
      user.crews.remove(crew._id);
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Member has been removed.') });
        res.sendStatus(200);
      });
    });
  });
});

router.delete('/', (req, res, next) => {
  Crew.findById(req.body._id, (err, event) => {
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
