const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scaledVersion = new Schema({
  filename: String,
  size: Number,
  height: Number,
  width: Number
});

const assetSchema = new Schema({
  mimetype: String,
  filename: String, // uuid
  originalname: String, // filename as its uploaded
  size: Number,
  height: Number,
  width: Number,
  versions: [scaledVersion],
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
