const router = require('../router')();
const User = require('../../models/User');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  User.find({}, (err, data) => {
    res.render('performers/list', {
      title: i18n.__('Performers'),
      data: data
    });
  });
});

module.exports = router;
