const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');
const uuid = require('uuid');
const sharp = require('sharp');

module.exports.sizes = {
  user: {
    profile: {
      height: 200,
      width: 512
    },
    teaser: {
      height: 400,
      width: 1920
    }
  },
  crew: {
    teaser: {
      height: 400,
      width: 1920
    }
  }
};

module.exports.resize = (assetId, params, done) => {
  Asset.findById(assetId, (err, asset) => {
    const scaledFilename = `${uuid.v4()}.jpeg`;
    sharp(`${process.env.STORAGE}${asset.filename}`)
    .resize(params.width, params.height)
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
