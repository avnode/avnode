const router = require('../router')();
const User = require('../../models/User');

router.get('/', (req, res, next) => {
  User.findOne({slug: req.params.slug}, (err, performer) => {
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
