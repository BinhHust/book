const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Binh <${process.env.EMAIL_FROM}>`;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        post: process.env.MAILTRAP_POST,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD
        }
      });
    }
    return nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      })
    );
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWellcome() {
    await this.send('wellcome', 'Wellcome to Book Store Website.');
  }
}

module.exports = Email;
