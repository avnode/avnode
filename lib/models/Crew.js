const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  image: String,
  teaserImage: String,
  name: String,
  about: String,
}, { timestamps: true });

crewSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/crews/' + this.slug;
});

crewSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'crews/' + this.slug;
});

crewSchema.pre('remove', function(next) {
  const crew = this;
  crew.model('User').update(
    { $pull: { crews: crew._id } },
    next
  );
});

const Crew = mongoose.model('Crew', crewSchema);
module.exports = Crew;
