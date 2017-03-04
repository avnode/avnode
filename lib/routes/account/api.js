const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

/**
 * Mock some APIs
 */
router.get('/user', (req, res) => {
  User
  .findById('5895e5393f5ee88115f8a2d0')
  .populate('events')
  .lean()
  .exec((err, user) => {
    res.json(user);
  });
});

router.put('/event/:id', (req, res) => {
  Event
  .findByIdAndUpdate(req.params.id, req.body)
  .exec((err) => {
    console.log(err);
  });
});

module.exports = router;
