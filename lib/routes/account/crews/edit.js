const router = require('../../router')();
const i18n = require('../../../plugins/i18n');
const async = require('async');
const uuid = require('uuid');
const mime = require('mime');

const imageUtil = require('../../../utilities/image');
const assetUtil = require('../../../utilities/asset');
const nav = require('../nav');
const subnav = require('./subnav');
const _slug = require('../../../utilities/slug');
const Crew = require('../../../models/Crew');
const User = require('../../../models/User');

const multer = require('multer');
// FIXME multiple occurrences
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE)
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`)
  }
});
const upload = multer({dest: process.env.STORAGE, storage: storage });

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

const up = upload.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/', up, (req, res, next) => {
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'];
        assetUtil.create({
          mimetype: file[0].mimetype,
          filename: file[0].filename,
          size: file[0].size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, {height: 400, width: 1920}, cb);
        });
      } else {
        cb(null);
      }
    },
  }, (err, results) => {
    Crew.findOne({slug: req.params.slug}, (err, crew) => {
      if (err) {
        return next(err);
      }
      if (results.image) {
        crew.image = results['image'];
      }
      crew.slug = _slug.parse(req.body.name);
      crew.name = req.body.name;
      crew.about = req.body.about;
      crew.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Crew has been updated.') });
        res.redirect(crew.editUrl);
      });
    });
  });
});

router.put('/members/:id', (req, res, next) => {
  Crew.findOne({ slug: req.params.slug }, (err, crew) => {
    User.findById(req.params.id, (err, user) => {
      user.crews.push(crew._id);
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Member has been added.') });
        res.sendStatus(200);
      });
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
