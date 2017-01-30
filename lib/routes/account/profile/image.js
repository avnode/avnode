const router = require('../../router')();
const multer = require('multer');
const upload = multer({ dest: process.env.STORAGE });
const sharp = require('sharp');
const User = require('../../../models/User');
const i18n = require('../../../plugins/i18n');

const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  res.render('account/profile/image', {
    title: i18n.__('Account Image'),
    nav: nav,
    navkey: 'profile',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', upload.single('image'), (req, res) => {
  generateSmallImage(req.file.filename, (err, _info) => {
    if (err) {
      throw err;
    }
    User.findById(req.user.id, (err, user) => {
      if (err) {
        throw err;
      }
      user.image = `${req.file.filename}_s.jpeg`;
      user.save((err) => {
        if (err) {
          throw err;
        }
        req.flash('success', { msg: __('Account image has been saved.') });
        res.redirect('/account/profile/image');
      });
    });
  });
});

module.exports = router;

const generateSmallImage = (filename, done) => {
  sharp(`${process.env.STORAGE}${filename}`)
    .resize(500, 200)
    .toFile(`${process.env.STORAGE}${filename}_s.jpeg`, done);
};
