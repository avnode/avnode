const router = require('../router')();
const User = require('../../models/User');
const _ = require('lodash');

router.get('/:q', (req, res) => {
  const term = new RegExp(req.params.q, 'i');
  User
  .find({ stagename: term })
  .limit(5)
  .exec(function(err, users) {
    if (users) {
      let data = [];
      data = users.map(function(user) {
        return _.pick(user, ['id', 'name', 'stagename']);
      });
      res.json(data);
    } else {
      res.json({});
    }
  });
});

module.exports = router;
