const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Crew = mongoose.model('Crew');
const slugify = require('../../utilities/slug').parse;

const fetchUser = (id, cb) => {
  User
  .findById(id)
  .populate('events crews')
  .lean()
  .exec(cb);
};

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
  const newEvent = new Event(Object.assign({}, req.body, {
    slug: slugify(req.body.title)
  }));
  newEvent.save((err, event) => {
    fetchUser(req.user.id, (err, user) => {
      user.events.push(event);
      User.update({ _id: user._id }, { events: user.events }, (_err) => {
        res.json(user);
      });
    });
  });
});

router.post('/crew', (req, res) => {
  const newCrew = new Crew(Object.assign({}, req.body, {
    name: req.body.title,
    slug: slugify(req.body.title)
  }));
  newCrew.save((err, event) => {
    fetchUser(req.user.id, (err, user) => {
      user.crews.push(event);
      User.update({ _id: user._id }, { crews: user.crews }, (_err) => {
        res.json(user);
      });
    });
  });
});

router.delete('/crew/:id', (req, res) => {
  Crew
  .findByIdAndRemove(req.params.id)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

router.put('/crew/:id', (req, res) => {
  Crew
  .findByIdAndUpdate(req.params.id, req.body)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

module.exports = router;
