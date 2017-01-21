const router = require('../router')();
const i18n = require('../../plugins/i18n');
const User = require('../../models/User');

router.get('/:uuid', (req, res) => {
  User.findOne({'confirm': req.params.uuid}, (err, user) => {
    if (err || user === null) {
      res.status(400).send('Error');
    } else {
      user.is_confirmed = true;
      user.confirm = '';
      user.save(function() {
        req.session.returnTo = '/';
        req.flash('success', { msg: i18n.__('Your account is confirmed, you can now log in.') });
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;
