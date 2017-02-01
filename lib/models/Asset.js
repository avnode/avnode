const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const version = new Schema({
  height: Number,
  width: Number,
});

const assetSchema = new Schema({
  type: String,
  identifier: String,
  originalname: String,
  size: Number
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
