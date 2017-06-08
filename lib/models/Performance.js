const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Performance');

const performanceSchema = new Schema({
  slug: { type: String, unique: true },
  image: {type:	Schema.ObjectId, ref: 'Asset'},
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  teaserImage: {type:	Schema.ObjectId, ref: 'Asset'},
  title: String,
  about: String,
  video: { type: Schema.ObjectId, ref: 'Asset' }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

// FIXME: Rename in performer?
performanceSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'performances'
});

performanceSchema.virtual('crews', {
  ref: 'Crew',
  localField: '_id',
  foreignField: 'performances'
});

performanceSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/performances/' + this.slug;
});

performanceSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'performances/' + this.slug;
});

performanceSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.image) {
    image = '/storage/' + this.image + '/512/200';
  }
  return image;
});

performanceSchema.pre('remove', function(next) {
  const performance = this;
  performance.model('User').update(
    { $pull: { performances: performance._id } },
    next
  );
  performance.model('Crew').update(
    { $pull: { performances: performance._id } },
    next
  );
});

performanceSchema.plugin(indexPlugin());

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
