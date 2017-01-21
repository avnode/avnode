const router = require('./router')();
const User = require('../models/User');
const i18n = require('../plugins/i18n');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('account/signup', {
    title: i18n.__('Create Account')
  });
});

router.post('/', (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    stagename: generateDummyStagename()
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: i18n.__('Account already exists.') });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

module.exports = router;

const generateDummyStagename = () => {
  return `${getAttribute()}_${getAnimal()}`;
};

const getAnimal = () => {
  // http://list25.com/25-most-popular-animals-on-google-search/
  const animals = [
    'Bison',
    'Dolphin',
    'Eagle',
    'Pony',
    'Ape',
    'Lobster',
    'Monkey',
    'Cow',
    'Deer',
    'Duck',
    'Rabbit',
    'Spider',
    'Wolf',
    'Turkey',
    'Lion',
    'Pig',
    'Snake',
    'Shark',
    'Bird',
    'Bear',
    'Fish',
    'Chicken',
    'Horse',
    'Cat',
    'Dog'
  ];

  return animals[(Math.floor(Math.random() * animals.length))].toLowerCase();
};

const getAttribute = () => {
  // http://examples.yourdictionary.com/examples-of-attributes.html
  const attributes = [
    'Achiever',
    'Active',
    'Adaptable',
    'Ambitious',
    'Balanced',
    'Candid',
    'Cheerful',
    'Communicative',
    'Compassionate',
    'Competitive',
    'Consistent',
    'Cooperative',
    'Courageous',
    'Curious',
    'Devoted',
    'Diplomatic',
    'Emotional',
    'Enterprising',
    'Enthusiastic',
    'Entrepreneurial',
    'Exciting',
    'Facilitator',
    'Fast',
    'Flexible',
    'Focused',
    'Forgiving',
    'Generous',
    'Genuine',
    'Good listener',
    'Helpful',
    'Imaginative',
    'Incredible',
    'Independent',
    'Industrious',
    'Initiator',
    'Insightful',
    'Interesting',
    'Inventive',
    'Knowledgeable',
    'Leader',
    'Literate',
    'Logical',
    'Meditative',
    'Mediator',
    'Modest',
    'Organized',
    'Original',
    'Outgoing',
    'Particular',
    'Patient',
    'Perceptive',
    'Personable',
    'Persuasive',
    'Pleasant',
    'Political',
    'Positive',
    'Powerful',
    'Practical',
    'Proactive',
    'Productive',
    'Professional',
    'Quality',
    'Quick',
    'Quirky',
    'Quixotic',
    'Racy',
    'Rebellious',
    'Responsible',
    'Sensible',
    'Sensitive',
    'Sensuous',
    'Sincere',
    'Skilled',
    'Solid',
    'Sporty',
    'Thoughtful',
    'Trustworthy',
    'Wise'
  ];

  return attributes[(Math.floor(Math.random() * attributes.length))].toLowerCase();
};
