const path = require('path');
const _ = require('lodash');
const mime = require('mime');
const Asset = require('../models/Asset');

module.exports.create = (params, done) => {
  const asset = new Asset({
    mimetype: params.mimetype,
    filename: params.filename,
    height: params.height,
    width: params.width,
    size: params.size
  });
  asset.save((err, savedAsset) => {
    done(err, savedAsset._id);
  });
};