const User = require('../models/User');

exports.getList = (req, res) => {
  User.find({}, (err, data) => {
    res.render('performer/list', {
      title: __('Performers'),
      data: data
    });
  });
};
