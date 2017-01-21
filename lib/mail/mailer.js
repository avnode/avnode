const path = require('path');
const _ = require('lodash');
const EmailTemplate = require('email-templates').EmailTemplate;
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const transporter = nodemailer.createTransport(ses({
  accessKeyId: 'AKIAJKA5O5MD3ZIHTPXQ',
  secretAccessKey: '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',
  region: 'eu-west-1'
}));

exports.signup = (options, data, cb) => {
  const template = path.join(__dirname, 'templates', 'signup');
  const mail = transporter.templateSender(new EmailTemplate(template));

  const defaults = {
    from: 'info@avnode.net',
    subject: 'AVnode.net – Welcome'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: 'http://localhost:3000/api/signup/'
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    return cb(null, info);
  });
}
