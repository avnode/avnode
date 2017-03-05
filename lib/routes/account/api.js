const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const slugify = require('../../utilities/slug').parse;

const fetchUser = (id, cb) => {
  User
  .findById(id)
  .populate('events')
  .lean()
  .exec(cb);
};

/**
 * Mock some APIs
 */
router.get('/user', (req, res) => {
  fetchUser(req.user.id, (err,user) => {
    res.json(user);
  });
});

router.put('/event/:id', (req, res) => {
  Event
  .findByIdAndUpdate(req.params.id, req.body)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

router.delete('/event/:id', (req, res) => {
  Event
  .findByIdAndRemove(req.params.id)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

router.post('/event', (req, res) => {
  console.log(req.body);
  const newEvent = new Event(Object.assign({}, req.body, {
    slug: slugify(req.body.title)
  }));
  newEvent.save((err, event) => {
    console.log('newEvent', err, event);
    User
    .findById(req.user.id)
    .exec((err, user) => {
      console.log(event);
      user.events.push(event._id);
      user.save((err, u) => {
        // FIXME: dafuq?
        // How do I get a lean version of an existing user without
        // fetching her again?
        console.log('user saved?', err, u);
        fetchUser(req.user.id, (err, leanUser) => {
          res.json(leanUser);
        });
      });
    });
  });
});

module.exports = router;
