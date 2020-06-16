const nodeMailer = require('nodemailer');
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
    // if (process.env.NODE_ENV === 'development') {
    return nodeMailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      post: process.env.MAILTRAP_POST,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });
    // }
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
