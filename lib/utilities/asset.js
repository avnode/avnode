const path = require('path');
const _ = require('lodash');
const mime = require('mime');
const Asset = require('../models/Asset');

module.exports.create = (params, done) => {
  const asset = new Asset({
    type: params.type,
    name: params.name,
    identifier: params.identifier,
    height: params.height,
    width: params.width,
    size: params.size
  });

  asset.save((err, savedAsset) => {
    if (err) {
      throw err;
    }
    done(null, savedAsset._id);
  });
};

module.exports.addVersion = (asset, version, done) => {

  console.log('asset', asset);
  console.log('version', version);

  asset.save((err) => {
    if (err) {
      throw err;
    }
    done(null, savedAsset._id);
  });
};
