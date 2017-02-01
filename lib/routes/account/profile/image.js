const mongoose = require('mongoose');
const router = require('../../router')();
const uuid = require('uuid');
const mime = require('mime');
const multer = require('multer');
const upload = multer({ dest: process.env.STORAGE });
const sharp = require('sharp');
const Asset = require('../../../models/Asset');
const User = require('../../../models/User');
const i18n = require('../../../plugins/i18n');

const assetUtil = require('../../../utilities/asset');

const nav = require('../nav');
const subnav = require('./subnav');

router.get('/', (req, res) => {
  User.populate(req.user, { path: 'image' }, (err, user) => {
    res.render('account/profile/image', {
      title: i18n.__('Account Image'),
      nav: nav,
      navkey: 'profile',
      subnav: subnav,
      user: user,
      path: req.originalUrl
    });
  });
});

router.post('/', upload.single('image'), (req, res) => {
  const asset = {
    type: req.file.mime,
    originalname: req.file.originalname,
    identifier: req.file.filename,
    name: `${req.file.filename}.${mime.extension(req.file.mimetype)}`,
  };
  console.log(req.file, asset);
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
    const scaledIdentifier = uuid.v4();
    sharp(`${process.env.STORAGE}${asset.identifier}`)
      .resize(500,200)
      .toFile(`${process.env.STORAGE}${scaledIdentifier}.jpeg`, (err, info) => {
        if (err) {
          throw err;
        }
        const opts = {
          type: mime.lookup(info.format),
          originalname:`${scaledIdentifier}.${mime.extension(info.format)}`,
          name:`${scaledIdentifier}.jpeg`,
          identifier:scaledIdentifier,
          height: info.height,
          width: info.width,
          size: info.size
        };
        assetUtil.create(opts, (err, scaledAssetId) => {
          asset.versions.push(scaledAssetId);
          asset.save((err) => {
            done(err, scaledAssetId);
          });
        });
      });
  });
};
