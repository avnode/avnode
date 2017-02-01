const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
  type: String,
  identifier: String, // uuid
  name: String, // uuid + file extension
  originalname: String, // filename as its uploaded
  size: Number,
  height: Number,
  width: Number,
  versions: [{
    type: Schema.ObjectId,
    ref: 'Asset'
  }]
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
