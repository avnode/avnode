const router = require('../router')();
const Crew = require('../../models/Crew');
const User = require('../../models/User');

router.get('/', (req, res, next) => {
  Crew
  .findOne({slug: req.params.slug})
  .populate('users')
  .exec((err, crew) => {
    if (err || crew === null) {
      return next(err);
    }
    User.find({ crews: { $in: [crew._id] } }, (err, members) => {
      res.render('crews/show', {
        title: crew.name,
        members: members,
        crew: crew
      });
    });
  });
});

module.exports = router;
