const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
// Require mogoose models once!
require('./lib/models');

const i18n = require('./lib/plugins/i18n');
const passport = require('./lib/plugins/passport');
const routes = require('./lib/routes');

const dotenv = require('dotenv');
dotenv.load({ path: '.env.local' });

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(i18n.init);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}));
// This blocks mocha testing, so we disable it
// in this context…
/**
const lusca = require('lusca');
if(process.env.NODE_ENV !== 'testing') {
  app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
  });
}
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
*/
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
  const path = req.path.split('/')[1];
  if (/auth|login|logout|signup|images|fonts/i.test(path)) {
    return next();
  }
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 84600 }));
app.use(routes);

app.use(function (err, req, res, _next) {
  if (err.isBoom) {
    req.flash('errors', { msg: err.message });
    return res.redirect('back');
  }
});

module.exports = app;
