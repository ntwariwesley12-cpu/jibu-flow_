const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  
    user: process.env.EMAIL_USER || "ntwariwesley12@gmail.com",
    pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "ntwariwesley12@gmail.com",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;