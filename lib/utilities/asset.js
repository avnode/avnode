const path = require('path');
const _ = require('lodash');
const mime = require('mime');
const Asset = require('../models/Asset');

module.exports.create = (file, cb) => {
  console.log(file);
  const asset = new Asset({
    originalname: file.originalname,
    identifier: file.filename,
    size: file.size,
    type: file.mime
  });

  asset.save((err, savedAsset) => {
    if (err) {
      throw err;
    }
    cb(null, savedAsset._id);
  });
};

module.exports.addVersion = () => {};
