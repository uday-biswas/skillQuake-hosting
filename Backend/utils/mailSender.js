const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "skillQuake",
      to: email,
      subject: title,
      html: body,
    });
    console.log(`info ${info}`);
    return info;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mailSender;
