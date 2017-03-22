const router = require('../router')();
const i18n = require('../../plugins/i18n');

const Crew = require('../../models/Crew');

router.get('/', (req, res) => {
  Crew.find({})
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('crews/list', {
      title: i18n.__('Crews'),
      data: data
    });
  });
});

module.exports = router;
