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
const { protect } = require("../middleware/auth");

router.post("/register", registerUser); // P-8 Create Account button
router.post("/login", loginUser); // P-7 Login Account button
router.post("/forgot-password", forgotPassword); // P-9 Send Reset Code button
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);       // User dashboard: update profile info
router.put("/change-password", protect, changePassword); // User dashboard: change password

module.exports = router;
