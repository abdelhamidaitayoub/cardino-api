const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.url = url;
    this.to = user.email;
    this.from = `Natours App <${process.env.EMAIL_FROM}>`;
    this.firstName = user.name.split(' ')[0];
  }

  newTronsport() {
    if (process.env.NODE_ENV.trim() === 'production') {
      // SENDINBLUE
      /*
      return nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
      */
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PROT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText(html),
    };
    await this.newTronsport().sendMail(mailOptions);
  }

  async sendWelcom() {
    await this.send('welcom', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset (valid for only 10 min)');
  }
};
