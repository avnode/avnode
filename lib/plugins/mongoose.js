const chalk = require('chalk');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.on('success', () => {
  console.log('mongo connect…');
});
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

module.exports = mongoose;
