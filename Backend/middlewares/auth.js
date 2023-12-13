const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //get token from header
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "No token, authorization denied",
      });
    }

    //verify token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).json({
        status: "fail",
        message: err.message,
      });
    }
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.isStudent = (req, res, next) => {
  if (req.user.accountType !== "student") {
    return res.status(403).json({
      status: "fail",
      message: "Student access denied",
    });
  }
  next();
};

exports.isInstructor = (req, res, next) => {
  if (req.user.accountType !== "instructor") {
    return res.status(403).json({
      status: "fail",
      message: "Instructor access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.accountType !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Admin access denied",
    });
  }
  next();
};
