const router = require('./router')();
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');
const _ = require('lodash');

router.get('/:asset/:width?/:height?', ({params}, res, _next) => {
  const options = {
    root: `${__dirname}/../../${process.env.STORAGE}`
  };
  Asset.findById(params.asset, (err, asset) => {
    let filename = null;
    if (asset) {
      filename = asset.filename;
      if (params.width && params.height) {
        const version = _.find(asset.versions, {
          'height': _.parseInt(params.height),
          'width': _.parseInt(params.width)
        });
        if (version) {
          filename = version.filename;
        } else {
          filename = null;
        }
      }
    }
    if (filename !== null) {
      res.sendFile(filename, options, (err) => {
        if (err) {
          console.log(err);
          res.redirect('/404');
        }
      });
    } else {
      res.redirect('/404');
    }
  });
});

module.exports = router;
