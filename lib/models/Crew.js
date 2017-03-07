const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Crew');

const crewSchema = new Schema({
  slug: { type: String, unique: true },
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  emails: [{
    email: String,
    is_public: {type: Boolean, default: false},
    is_primary: {type: Boolean, default: false},
    is_confirmed: { type: Boolean, default: false },
    confirm: String
  }],
  image: {type:	Schema.ObjectId, ref: 'Asset'},
  teaserImage: String,
  name: String,
  about: String
}, { timestamps: true });

crewSchema.virtual('members', {
  ref: 'User',
  localField: '_id',
  foreignField: 'crews'
});

crewSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/crews/' + this.slug;
});

crewSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'crews/' + this.slug;
});

crewSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.image) {
    image = '/storage/' + this.image + '/1920/400';
  }
  return image;
});

crewSchema.pre('remove', function(next) {
  const crew = this;
  crew.model('User').update(
    { $pull: { crews: crew._id } },
    next
  );
});

crewSchema.plugin(indexPlugin());

const Crew = mongoose.model('Crew', crewSchema);
module.exports = Crew;
