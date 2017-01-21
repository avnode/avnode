const path = require('path');
const _ = require('lodash');
const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');

const getTransporter = () => {
  return nodemailer.createTransport(ses({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'eu-west-1'
  }));
};

module.exports.signup = (options, data, cb) => {
  const template = path.join(__dirname, 'templates', 'signup');
  const mail = getTransporter().templateSender(new EmailTemplate(template));

  const defaults = {
    from: process.env.MAILFROM,
    subject: 'AVnode.net – Welcome'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: process.env.BASE
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    return cb(null, info);
  });
};
