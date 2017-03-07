const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Crew = mongoose.model('Crew');
const slugify = require('../../utilities/slug').parse;

// All for the image upload…
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const async = require('async');
const imageUtil = require('../../utilities/image');
const assetUtil = require('../../utilities/asset');

const fetchUser = (id, cb) => {
  User
  .findById(id)
  .populate('events')
  .populate({
    //path: 'events',
    path: 'crews',
    model: 'Crew',
    populate: {
      path: 'image',
      model: 'Asset'
    }
  })
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

// Image upload…
// const multer = require('multer');
// FIXME multiple occurrences
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE);
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`);
  }
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
          imageUtil.resize(assetId, {height: 400, width: 1920}, cb);
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

// FIXME: move…
const elasticsearch = require('../../plugins/elasticsearch');
const esClient = elasticsearch.getClient();
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
  const stubbedResults = [{
    id: 8628622,
    name: 'Stefan Isak',
    stagename: 'PinkPantera'
  },{
    id: 87456,
    name: 'Patrick Finkbeiner',
    stagename: 'FinkIt'
  }];
  esClient.search(s, (err, results) => {
    console.log('err', err); // FIXME: handle errors;
    //res.json(results);
    res.json(stubbedResults);
  });
});

module.exports = router;
