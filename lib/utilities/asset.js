const _ = require('lodash');
const sizeOf = require('image-size');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');
const User = mongoose.model('User');

const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const vimeoRegex = /(?:https?\:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/;

const isYoutube = (url) => {
  return youtubeRegex.test(url);
};

const isVimeo = (url) => {
  return vimeoRegex.test(url);
};

const getVideoType = (url) => {
  if (isYoutube(url)) {
    return 'youtube';
  } else if (isVimeo(url)) {
    return 'vimeo';
  } else {
    return 'unknown';
  }
};

const getStorageFolder = () => {
  return `${__dirname}/../../${process.env.STORAGE}`;
};

const createImageAsset = (params, user, done) => {
  const identifier = setIdentifier(user);
  const dimensions = sizeOf(getStorageFolder() + '/' + params.filename);
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

const createScaledAsset = (params, user, done) => {
  const identifier = setIdentifier(user);
  const dimensions = sizeOf(getStorageFolder() + '/' + params.filename);
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
  const identifier = setIdentifier(user);
  return new Asset({
    type: 'video',
    owner: user._id,
    identifier: identifier,
    publicUrl: '/storage/' + identifier,
    video: {
      type: getVideoType(url),
      url: url
    }
  });
};

const setIdentifier = (user) => {
  return user.stagename + '_' + uuid.v4();
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

module.exports.isYoutube = isYoutube;
module.exports.isVimeo = isVimeo;
module.exports.getVideoType = getVideoType;
module.exports.setIdentifier = setIdentifier;
module.exports.getStorageFolder = getStorageFolder;
