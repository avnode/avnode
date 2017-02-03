const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

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
