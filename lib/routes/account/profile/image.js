const router = require('../../router')();
const uuid = require('uuid');
const mime = require('mime');
const async = require('async');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const i18n = require('../../../plugins/i18n');
const imageUtil = require('../../../utilities/image');
const assetUtil = require('../../../utilities/asset');
const nav = require('../nav');
const subnav = require('./subnav');

const multer = require('multer');
// FIXME multiple occurrences
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE);
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`);
  }
});
const upload = multer({dest: process.env.STORAGE, storage: storage });

router.get('/', (req, res) => {
  const opts = [{ path: 'image' }, { path: 'teaserImage' }];
  User.populate(req.user, opts, (err, user) => {
    res.render('account/profile/image', {
      title: i18n.__('Your Profile'),
      subtitle: i18n.__('Manage your account'),
      nav: nav,
      navkey: 'profile',
      subnav: subnav,
      user: user,
      path: req.originalUrl
    });
  });
});

const up = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'teaserImage', maxCount: 1 }
]);
router.post('/', up, (req, res, next) => {
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create('image', file, req.user._id, (err, assetId) => {
          if (err) {
            throw err;
          }
          imageUtil.resize(assetId, {height: 200, width: 512}, cb);
        });
      } else {
        cb(null);
      }
    },
    teaserImage: (cb) => {
      if (req.files['teaserImage']) {
        const file = req.files['teaserImage'][0];
        assetUtil.create('image', file, req.user._id, (err, assetId) => {
          if (err) {
            throw err;
          }
          imageUtil.resize(assetId, {height: 400, width: 1920}, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    if (results) {
      User.findById(req.user.id, (err, user) => {
        if (err) {
          return next(err);
        }
        if (results.image) {
          user.image = results['image'];
        }
        if (results.teaserImage) {
          user.teaserImage = results['teaserImage'];
        }
        user.save((err) => {
          if (err) {
            throw err;
          }
          req.flash('success', { msg: i18n.__('Account image has been saved.') });
          res.redirect('/account/profile/image');
        });
      });
    } else {
      res.redirect('/account/profile/image');
    }
  });
});

module.exports = router;
