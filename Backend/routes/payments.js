// Import the required modules
const express = require("express");
const router = express.Router();

const {
  enrollTheStudent,
  leaveCourse,
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/paymentController");
const { auth, isStudent } = require("../middlewares/auth");

router.post("/enroll", auth, isStudent, enrollTheStudent);
router.post("/leave", auth, isStudent, leaveCourse);
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
