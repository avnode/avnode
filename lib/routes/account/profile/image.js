const mongoose = require('mongoose');
const router = require('../../router')();
const uuid = require('uuid');
const mime = require('mime');
const sharp = require('sharp');
const Asset = require('../../../models/Asset');
const User = require('../../../models/User');
const i18n = require('../../../plugins/i18n');
const assetUtil = require('../../../utilities/asset');
const nav = require('../nav');
const subnav = require('./subnav');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE)
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`)
  }
});
const upload = multer({dest: process.env.STORAGE, storage: storage });

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
  const asset = {
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    originalname: req.file.originalname,
    size: req.file.size
  };
  assetUtil.create(asset, (err, assetId) => {
    generateSmallImage(assetId, (err, scaledAssetId) => {
      if (err) {
        throw err;
      }
      User.findById(req.user.id, (err, user) => {
        if (err) {
          throw err;
        }
        user.image = scaledAssetId;
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
});

module.exports = router;

const generateSmallImage = (assetId, done) => {
  Asset.findById(assetId, (err, asset) => {
    const scaledFilename = `${uuid.v4()}.jpeg`;
    sharp(`${process.env.STORAGE}${asset.filename}`)
    .resize(500,200)
    .toFile(`${process.env.STORAGE}${scaledFilename}`, (err, info) => {
      if (err) {
        throw err;
      }
      const version = {
      	filename: scaledFilename,
        height: info.height,
        width: info.width,
        size: info.size
      };
      asset.versions.push(version);
      asset.save((err) => {
        done(err, assetId);
      });
    });
  });
};
