const passport = require('passport');
const countries = require('country-list')().getData();
const User = require('../models/User');
const Joi = require('joi');

const nav = [{
  url: '/account/profile',
  title: __('Profile')
},{
  url: '/account/password',
  title: __('Password')
},{
  url: '/account/emails',
  title: __('Emails')
},{
  url: '/account/settings',
  title: __('Settings')
}];

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: __('Login')
  });
};

exports.postLoginSchema = {
  body: {
    _csrf: Joi.string().required().error(new Error(__('Sorry, malformed request.'))),
    email: Joi.string().email().required().error(new Error(__('E-mail is not correct.'))),
    password: Joi.string().required().error(new Error(__('Password is required!')))
  }
};
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: __('You are logged in.') });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('account/signup', {
    title: __('Create Account')
  });
};

exports.postSignup = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    stagename: generateDummyStagename()
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: __('Account already exists.') });
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
};

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
  ]

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
}

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getAccount = (req, res) => {
  res.redirect('/account/profile');
};

exports.getProfile = (req, res) => {
  res.render('account/profile', {
    title: __('Account Profile'),
    path: req.path,
    nav: nav,
    countries: countries
  });
};
exports.postProfile = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.profile.gender = req.body.gender || '';
    user.profile.name = req.body.name || '';
    user.profile.birthday = req.body.birthday || '';
    user.profile.about = req.body.about || '';
    user.profile.citizenship = req.body.citizenship || '';
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Profile information has been updated.') });
      res.redirect('/account/profile');
    });
  });
};

exports.getPassword = (req, res) => {
  res.render('account/password', {
    title: __('Account Password'),
    nav: nav,
    path: req.path
  });
};
exports.postPassword = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) { return next(err); }
      if (isMatch) {
        user.password = req.body.newPassword;
        user.save((err) => {
          if (err) { return next(err); }
          req.flash('success', { msg: 'Password has been changed.' });
          res.redirect('/account/password');
        });
      } else {
        req.flash('errors', { msg: 'Password has not been changed.' });
        res.redirect('/account/password');
      }
    })
  });
};

exports.getEmails = (req, res) => {
  res.render('account/emails', {
    title: __('Account Emails'),
    nav: nav,
    path: req.path
  });
};
exports.postEmails = (req, res, next) => {
  res.redirect('/account/emails');
};

exports.getSettings = (req, res) => {
  res.render('account/settings', {
    title: __('Account Settings'),
    nav: nav,
    path: req.path
  });
};
exports.postSettings = (req, res, next) => {
  res.redirect('/account/settings');
};
