const router = require('../../router')();
const async = require('async');
const multer = require('multer');
const upload = multer({ dest: process.env.STORAGE });
const sharp = require('sharp');
const User = require('../../../models/User');
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  res.render('account/profile/image', {
    title: __('Your Profile'),
    subtitle: __('Manage your account'),
    nav: nav,
    navkey: 'profile',
    subnav: subnav,
    path: req.originalUrl
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
        const filename = req.files['image'][0].filename;
        sharp(`${process.env.STORAGE}${filename}`)
        .resize(512, 200)
        .toFile(`${process.env.STORAGE}${filename}.jpeg`, cb);
      } else {
        cb(null);
      }
    },
    teaserImage: (cb) => {
      if (req.files['teaserImage']) {
        const filename = req.files['teaserImage'][0].filename;
        sharp(`${process.env.STORAGE}${filename}`)
        .resize(1920, 400)
        .toFile(`${process.env.STORAGE}${filename}.jpeg`, cb);
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
          user.image = `${req.files['image'][0].filename}.jpeg`;
        }
        if (results.teaserImage) {
          user.teaserImage = `${req.files['teaserImage'][0].filename}.jpeg`;
        }
        user.save((err) => {
          if (err) {
            throw err;
          }
          req.flash('success', { msg: __('Account image has been saved.') });
          res.redirect('/account/profile/image');
        });
      });
    } else {
      res.redirect('/account/profile/image');
    }
  });
});

module.exports = router;

const generateSmallImage = (filename, done) => {
};
