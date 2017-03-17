const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

const assetUtil = require('./asset');
const uuid = require('uuid');
const sharp = require('sharp');

module.exports.resize = (assetId, params, done) => {
  Asset.findById(assetId, (err, asset) => {
    const scaledFilename = `${uuid.v4()}.jpeg`;
    sharp(`${process.env.STORAGE}${asset.image.filename}`)
    .resize(params.width, params.height)
    .toFile(`${process.env.STORAGE}${scaledFilename}`, (err, info) => {
      if (err) {
        throw err;
      }
      assetUtil.create('scaled', {
        mimetype: 'image/jpeg',
        filename: scaledFilename,
        origin: assetId,
        size: info.size
      }, asset.owner, done);
    });
  });
};
