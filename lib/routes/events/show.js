const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

router.get('/', (req, res, next) => {
  Event
  .findOne({slug: req.params.slug})
  .populate([{
    path: 'image',
    model: 'Asset'
  },{
    path: 'teaserImage',
    model: 'Asset'
  }, {
    path: 'organizers',
    model: 'User',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  }])
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
