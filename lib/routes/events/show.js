const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

router.get('/', (req, res, next) => {
  Event
  .findOne({slug: req.params.slug})
  .populate('user')
  .exec((err, event) => {
    if (err || event === null) {
      return next(err);
    }
    res.render('events/show', {
      title: event.title,
      event: event
    });
  });
});

module.exports = router;
