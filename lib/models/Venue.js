const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
//const indexPlugin = require('../plugins/elasticsearch/Venue');

const venueSchema = new Schema({
  address: String,
  geometry: Object,
  place_id: String
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

//venueSchema.plugin(indexPlugin());

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
