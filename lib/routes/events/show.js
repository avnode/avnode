const router = require('../router')();
const Event = require('../../models/Event');

router.get('/', (req, res, next) => {
  Event
  .findOne({slug: req.params.slug})
  .populate('users')
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
