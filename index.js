const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const expressStatusMonitor = require('express-status-monitor');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');

const dotenv = require('dotenv');
dotenv.load({ path: '.env.local' });

const i18n = require('i18n');
i18n.configure({
    locales:['en'],
    defaultLocale: 'en',
    directory: __dirname + '/locales',
    register: global
});

const homeController = require('./controllers/home');
const userController = require('./controllers/user');

const passportConfig = require('./config/passport');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

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
app.use(expressValidator());
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

app.get('/', homeController.index);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);

app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account', passportConfig.isAuthenticated, userController.postProfile);

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});
module.exports = app;
