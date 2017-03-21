const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const slugify = require('../../utilities/slug').parse;
const allCountries = require('node-countries-list');
const R = require('ramda');

// All for the image upload…
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const async = require('async');
const imageUtil = require('../../utilities/image');
const assetUtil = require('../../utilities/asset');

const elasticsearch = require('../../plugins/elasticsearch');

const fetchUser = (id, cb) => {
  User
  .findById(id)
  .populate([{
    path: 'image',
    model: 'Asset'
  },{
    path: 'teaserImage',
    model: 'Asset'
  },{
    path: 'events',
    model: 'Event',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  },{
    path: 'performances',
    model: 'Performance',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  }, {
    path: 'crews',
    model: 'Crew',
    populate: [{
      path: 'image',
      model: 'Asset'
    },{
      path: 'members'
    }]
  }])
  //.lean()
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

// Image upload…
// FIXME multiple occurrences
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE);
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`);
  }
});
// FIXME of course upload3 is bullshit, but since we need to split
// this file into pieces, new names are worthless anyway
const upload3 = multer({dest: process.env.STORAGE, storage: storage });
const up3 = upload3.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/event/:id/image', up3, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create({
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.event.image, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return next(err);
      }
      event.image = results['image'];
      event.save((err) => {
        if (err) {
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.post('/crew', (req, res) => {
  const newCrew = new Crew(Object.assign({}, req.body, {
    name: req.body.title,
    slug: slugify(req.body.title),
    members: []
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

const upload = multer({dest: process.env.STORAGE, storage: storage });
const up = upload.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/crew/:id/image', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create({
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.crew.teaser, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    Crew.findById(req.params.id, (err, crew) => {
      if (err) {
        return next(err);
      }
      crew.image = results['image'];
      crew.save((err) => {
        if (err) {
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.put('/crew/:id/member/:memberId', (req, res) => {
  User
  .findById(req.params.memberId)
  .exec((err, user) => {
    user.crews.push(req.params.id);
    user.save((_err) => {
      // FIXME: Handle error…
      //
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
  });
});

router.delete('/crew/:id/member/:memberId', (req, res) => {
  User
  .findById(req.params.memberId)
  .exec((err, user) => {
    user.crews.remove(req.params.id);
    user.save((_err) => {
      // FIXME: Handle error…
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
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

router.post('/performance', (req, res) => {
  const newPerformance = new Performance(Object.assign({}, req.body, {
    title: req.body.title,
    slug: slugify(req.body.title)
  }));
  newPerformance.save((err, performance) => {
    fetchUser(req.user.id, (err, user) => {
      user.performances.push(performance);
      User.update({ _id: user._id }, { performances: user.performances }, (_err) => {
        res.json(user);
      });
    });
  });
});

router.delete('/performance/:id', (req, res) => {
  Performance
  .findByIdAndRemove(req.params.id)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

const upload2 = multer({dest: process.env.STORAGE, storage: storage });
const up2 = upload2.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/performance/:id/image', up2, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create({
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.performance.image, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    Performance.findById(req.params.id, (err, performance) => {
      if (err) {
        return next(err);
      }
      performance.image = results['image'];
      performance.save((err) => {
        if (err) {
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.put('/performance/:id', (req, res) => {
  Performance
  .findByIdAndUpdate(req.params.id, req.body)
  .exec((err) => {
    console.log(err);
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});

router.get('/search/user', (req, res) => {
  const q = req.query.q;
  const s = {
    index: elasticsearch.INDEX,
    type: 'user',
    body: {
      query: {
        // FIXME: only return three necessary fields…
        query_string: {
          query: q
        }
      }
    }
  };
  elasticsearch.getClient().search(s, (err, results) => {
    const flatResults = results.hits.hits.map((h) => {
      console.log('hit', h);
      return {
        id: h._id,
        stagename: h._source.stagename,
        name: '',
        imageUrl: h._source.imageUrl
      };
    });
    res.json(flatResults);
  });
});

router.post('/user/:id/image/profile', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create({
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.user.profile, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return next(err);
      }
      user.image = results['image'];
      user.save((err) => {
        if (err) {
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.post('/user/:id/image/teaser', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.create({
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.user.teaser, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return next(err);
      }
      user.teaserImage = results['image'];
      user.save((err) => {
        if (err) {
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.get('/countries', (req, res) => {
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
});

module.exports = router;
