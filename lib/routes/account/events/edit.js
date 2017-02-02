const router = require('../../router')();
const i18n = require('../../../plugins/i18n');
const sharp = require('sharp');
const request = require('request');
const async = require('async');
const uuid = require('uuid');
const mime = require('mime');

const nav = require('../nav');
const subnav = require('./subnav');
const assetUtil = require('../../../utilities/asset');
const imageUtil = require('../../../utilities/image');
const _slug = require('../../../utilities/slug');
const Event = require('../../../models/Event');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE)
  },
  filename: (req, file, cb) => {
    cb(null,`${uuid.v4()}.${mime.extension(file.mimetype)}`)
  }
});
const upload = multer({dest: process.env.STORAGE, storage: storage });

router.get('/', (req, res) => {
  Event.findOne({slug: req.params.slug}, (err, event) => {
    res.render('account/events/edit', {
      title: i18n.__('Events'),
      subtitle: i18n.__('Manage your events'),
      nav: nav,
      navkey: 'events',
      subnav: subnav,
      path: req.originalUrl,
      event: event
    });
  });
});

router.post('/', upload.single('image'), (req, res, next) => {
  Event.findOne({slug: req.params.slug}, (err, event) => {
    if (err) {
      return next(err);
    }

    event.slug = _slug.parse(req.body.title);
    event.title = req.body.title;
    event.subtitle = req.body.subtitle;
    event.starts = req.body.starts;
    event.ends = req.body.ends;
    event.about = req.body.about;

    async.parallel({
      geocode: (cb) => {
        if (req.body.address && req.body.address !== event.address) {
          let url = process.env.GOOGLEMAPSAPIURL;
          url += '&address=' + encodeURIComponent(req.body.address);
          request(url, function (err, resp, body) {
            if (!err && resp.statusCode === 200) {
              cb(null, JSON.parse(body));
            } else {
              cb(err);
            }
          });
        } else {
          cb(null);
        }
      },
      imagescale: (cb) => {
        if (req.file) {
          const file = req.file;
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
      if (err) {
        return next(err);
      }
      if (results.geocode) {
        event.address = results.geocode.results[0].formatted_address;
      }
      if (results.imagescale) {
        event.image = results.imagescale;
      }
      event.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: __('Event has been updated.') });
        res.redirect(event.editUrl);
      });
    });
  });
});

router.delete('/', (req, res, next) => {
  Event.findById(req.body._id, (err, event) => {
    if (err) {
      return next(err);
    }
    event.remove((err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;
