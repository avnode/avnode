const sizeOf = require('image-size');
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');
const User = mongoose.model('User');

const helper = require('./helper');

const createImageAsset = (params, user) => {
  const identifier = helper.setIdentifier(user);
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'image',
    owner: user._id,
    identifier: identifier,
    publicUrl: '/storage/' + identifier,
    image: {
      mimetype: params.mimetype,
      filename: params.filename,
      originalname: params.originalname,
      height: dimensions.height,
      width: dimensions.width,
      size: params.size
    }
  });
};

const createScaledAsset = (params, user) => {
  const identifier = helper.setIdentifier(user);
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'scaled',
    owner: user._id,
    identifier: identifier,
    publicUrl: '/storage/' + identifier,
    origin: params.origin,
    image: {
      mimetype: params.mimetype,
      filename: params.filename,
      height: dimensions.height,
      width: dimensions.width,
      size: params.size
    }
  });
};

const createVideoAsset = (url, user) => {
  const identifier = helper.setIdentifier(user);
  const hoster = helper.getVideoType(url);
  let id = null;
  if (hoster === 'youtube') {
    id = helper.youtubeParser(url);
  } else if (hoster === 'vimeo') {
    id = helper.vimeoParser(url);
  }

  return new Asset({
    type: 'video',
    owner: user._id,
    identifier: identifier,
    publicUrl: '/storage/' + identifier,
    video: {
      type: hoster,
      id: id,
      url: url
    }
  });
};

module.exports.create = (type, params, userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) {
      throw err;
    }
    switch (type) {
    case 'image':
      createImageAsset(params, user).save((err, saved) => done(err, saved._id));
      break;
    case 'scaled':
      createScaledAsset(params, user).save((err, saved) => done(err, saved._id));
      break;
    case 'video':
      createVideoAsset(params, user).save((err, saved) => done(err, saved._id));
      break;
    default:
      done('Invalid asset type ' + type);
    }
  });
};
