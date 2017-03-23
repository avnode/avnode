const router = require('../router')();
const mongoose = require('mongoose');
const Performance = mongoose.model('Performance');

router.get('/', (req, res, next) => {
  Performance
  .findOne({slug: req.params.slug})
  .populate([{
    path: 'image',
    model: 'Asset'
  },{
    path: 'teaserImage',
    model: 'Asset'
  }])
  .exec((err, performance) => {
    if (err || performance === null) {
      return next(err);
    }
    res.render('performances/show', {
      title: performance.title,
      performance: performance
    });
  });
});

module.exports = router;
