const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 10 * 60,
  },
});

async function sendVerificationEmail(email, otp, next) {
  const title = "Verification mail from SkillQuake";
  const body = `<p>Hi there,</p>
        <p>Thanks for registering at SkillQuake.</p>
        <p>Please enter the following OTP to verify your email address:</p>
        <h3>${otp}</h3>
        <p>Thanks,</p>
        <p>SkillQuake Team</p>`;
  const mailResponse = await mailSender(email, title, body);
  if (mailResponse) {
    next();
  } else {
    next(new Error("Email sending failed"));
  }
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp, next);
  // next();
});

module.exports = mongoose.model("otp", otpSchema);
