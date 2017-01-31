const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  slug: { type: String, unique: true },
  user: { type : Schema.ObjectId, ref : 'User' },
  title: String,
  subtitle: String,
  image: String,
  about: String,
  website: String,
  is_public: { type: Boolean, default: true },
  is_closed: { type: Boolean, default: true }
});

eventSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/events/' + this.slug;
});

eventSchema.pre('remove', function(next) {
  const event = this;
  event.model('User').update(
    { $pull: { events: event._id } },
    next
  );
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
