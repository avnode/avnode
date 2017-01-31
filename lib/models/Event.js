const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const eventSchema = new Schema({
  slug: { type: String, unique: true },
  user: { type : Schema.ObjectId, ref : 'User' },
  title: String,
  subtitle: String,
  image: String,
  starts: Date,
  ends: Date,
  about: String,
  website: String,
  is_public: { type: Boolean, default: true },
  is_closed: { type: Boolean, default: true }
});

eventSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/events/' + this.slug;
});

eventSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'events/' + this.slug;
});

eventSchema.virtual('startsFormatted').get(function () {
  return moment(this.starts).format(process.env.DATEFORMAT);
});

eventSchema.virtual('endsFormatted').get(function () {
  return moment(this.ends).format(process.env.DATEFORMAT);
});

eventSchema.virtual('dateFormatted').get(function () {
  let date = '';
  if (this.ends && this.startsFormatted !== this.endsFormatted) {
    date = moment(this.starts).format('MMMM Do');
    date += ' - ' + moment(this.starts).format('MMMM Do YYYY');
  } else {
    date = moment(this.starts).format('MMMM Do YYYY');
  }
  return date;
});

eventSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.image) {
    // FIXME storage might be a config
    image = '/storage/' + this.image;
  }
  return image;
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
