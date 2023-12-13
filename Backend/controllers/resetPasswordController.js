const user = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req.body
    const { email } = req.body;
    //check user for this email
    const getUser = await user.findOne({ email });
    if (!getUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    //generate reset token
    const token = crypto.randomUUID();
    console.log("the crypto token is: ", token);
    //update user by adding token and token expiry date
    const updateUser = await user.findByIdAndUpdate(
      getUser._id,
      {
        token,
        resetPasswwordExpires: Date.now() + 10 * 60 * 1000,
      },
      { new: true }
    );
    //create url
    const port = process.env.PORT || 5000;
    const url = `http://localhost:${port}/resetPassword/${token}`;
    //send email containing url
    const message = `Please click on the link below to reset your password:\n${url}`;
    await mailSender(updateUser.email, "Password Reset Link", message);
    //return response
    return res.status(200).json({
      status: "success",
      message: "Reset password link sent to your email",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    //check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Password and confirm password do not match",
      });
    }
    //check user for this token
    const getUser = await user.findOne({ token: token });
    if (!getUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    //check if token has expired
    if (getUser.resetPasswwordExpires < Date.now()) {
      return res.status(400).json({
        status: "fail",
        message: "Token has expired",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update user by adding new password and removing token and token expiry date
    const updateUser = await user.findByIdAndUpdate(
      getUser._id,
      {
        password: hashedPassword,
        token: "",
        resetPasswwordExpires: null,
      },
      { new: true }
    );
    //return response
    return res.status(200).json({
      status: "success",
      updateUser,
      message: "Password reset successfull",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
