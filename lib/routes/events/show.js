const router = require('../router')();
const Event = require('../../models/Event');
const User = require('../../models/User');

router.get('/', (req, res, next) => {
  Event
  .findOne({slug: req.params.slug})
  .exec((err, event) => {
    if (err || event === null) {
      return next(err);
    }
    User.find({ events: { $in: [event._id] } }, (err, users) => {
      res.render('events/show', {
        title: event.title,
        users: users,
        event: event
      });
    });
  });
});

module.exports = router;
