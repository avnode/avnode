const router = require('../router')();
const Event = require('../../models/Event');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  Event.find({}, (err, data) => {
    res.render('events/list', {
      title: i18n.__('Events'),
      data: data
    });
  });
});

module.exports = router;