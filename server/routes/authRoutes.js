const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const handleBodyParse = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    upload.none()(req, res, next);
  } else {
    next();
  }
};

router.post("/register", handleBodyParse, registerUser); // P-8 Create Account button
router.post("/login", handleBodyParse, loginUser); // P-7 Login Account button
router.post("/forgot-password", handleBodyParse, forgotPassword); // P-9 Send Reset Code button
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);       // User dashboard: update profile info
router.put("/change-password", protect, changePassword); // User dashboard: change password

module.exports = router;
