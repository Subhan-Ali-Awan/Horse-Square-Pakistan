const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// Helper: sign a JWT for a given user id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper: build the safe user object sent back to the frontend (never send password)
const buildUserResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  city: user.city,
  userType: user.userType,
  role: user.role,
  status: user.status,
});

// ===================================================
// POST /api/auth/register   -> matches P-8_New_registration_fyp.html
// ===================================================
exports.registerUser = async (req, res, next) => {
  try {
    let { firstName, lastName, name, email, phone, city, password, confirmPassword, userType } = req.body;

    if (name && (!firstName || !lastName)) {
      const parts = name.trim().split(" ");
      firstName = parts[0] || "User";
      lastName = parts.slice(1).join(" ") || "Account";
    }

    if (!city) city = "Lahore";
    if (!userType) userType = "Horse Seller";
    if (!firstName) firstName = "User";
    if (!lastName) lastName = "Account";

    if (!email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      city,
      password,
      userType,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/login   -> matches P-7_login_page_fyp.html
// ===================================================
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // .select("+password") because password has select:false in the schema
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ success: false, message: "Your account has been blocked. Contact support." });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/forgot-password  -> matches P-9_Code_for_reset_fyp.html (Send Reset Code)
// ===================================================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your registered email" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success even if email not found - prevents leaking which emails are registered
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email is registered, a reset code has been sent.",
      });
    }

    // Generate a 6-digit numeric reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();

    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 60 * 1000 * 10; // valid 10 minutes (frontend resend timer is 60s)
    await user.save();

    // ---- In a real deployed project you'd email this code via nodemailer ----
    // For FYP/demo purposes we log it to the server console so you can test the flow:
    console.log(`📧 Password reset code for ${user.email}: ${resetCode}`);

    res.status(200).json({
      success: true,
      message: "Reset code sent successfully. Check your email.",
      // devCode is only included so you can test without setting up a real mail server.
      // REMOVE this field before submitting/deploying your final project.
      devCode: resetCode,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/verify-reset-code
// ===================================================
exports.verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() },
    }).select("+resetCode +resetCodeExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    res.status(200).json({ success: true, message: "Code verified. You may now reset your password." });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/reset-password
// ===================================================
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, code, and new password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() },
    }).select("+resetCode +resetCodeExpires +password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    user.password = newPassword; // gets hashed automatically by the pre-save hook
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/auth/me  (protected) - get currently logged in user
// ===================================================
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: buildUserResponse(req.user) });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/auth/profile  (protected) - update profile info
// ===================================================
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, city, userType } = req.body;
    const user = await require("../models/User").findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone) user.phone = phone.trim();
    if (city) user.city = city.trim();
    if (userType) user.userType = userType;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/auth/change-password  (protected) - change password
// ===================================================
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await require("../models/User").findById(req.user._id).select("+password");

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword; // hashed automatically by pre-save hook
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

