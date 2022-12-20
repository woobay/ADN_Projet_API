const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const user = process.env.USER_MAILTRAP
const pass = process.env.PASS_MAILTRAP
const host = process.env.HOST_MAILTRAP
const port = process.env.PORT_MAILTRAP
const mail_sender = process.env.MAIL_SENDER

var transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass
    }
  });

  module.exports.sendEmail = (name, email, confir_URL) => {
    transport.sendMail({
        from: mail_sender,
        to: email,
        subject: `Bienvenue ${name} Ami Boycotteur!!`,
        html: `<h1>Confirmation du Couriel</h1>
            <p>
            Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer    une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum
            </p>
            <a style="font-size:30px; color: bleu" href=${confir_URL}>CLIQUEZ-ICI</a>`
    }).catch(err => console.log(err))
  }