const mailcomposer = require('mailcomposer');
const MailGun = require('mailgun-js');
const config = require('config');

const mailgun = MailGun({
  apiKey: config.keys.mailgun,
  domain: config.addresses.mailgun.domain
});

/**
 * @typedef {object} SendEmailOptions
 * @prop {string} to
 * @prop {string} from
 * @prop {string} subject
 * @prop {string} html
 */
/**
 * Sends an email.
 * @async
 * @param {SendEmailOptions} options
 * @return {object} MailGun response
 */
module.exports = options =>
  new Promise((resolve, reject) => {
    mailcomposer(options).build((err, message) =>
      mailgun
        .messages()
        .sendMime(
          { to: options.to, message: message.toString('ascii') },
          (err, body) => (err ? reject(err) : resolve(body))
        )
    );
  });
