const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res, next) => {
  User
  .findOne({slug: req.params.slug})
  .populate('events')
  .exec((err, performer) => {
    if (err || performer === null) {
      return next(err);
    }
    res.render('performers/show', {
      title: performer.stagename,
      performer: performer
    });
  });
});

module.exports = router;
