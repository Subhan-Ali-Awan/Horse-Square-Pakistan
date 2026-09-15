const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendWelcomeEmail, sendEmailVerificationOtp } = require("../utils/emailService");

// Helper: Check if email has valid official format and domain structure
const isValidOfficialEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.trim().toLowerCase();
  
  // RFC-compliant email regex: user@domain.tld (tld >= 2 letters)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (!emailRegex.test(cleanEmail)) return false;

  const parts = cleanEmail.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];

  if (!domain || !domain.includes(".")) return false;
  if (domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) return false;

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) return false;

  return true;
};

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
  cnic: user.cnic || "",
  address: user.address || "",
  avatar: user.avatar || "",
  userType: user.userType,
  role: user.role,
  status: user.status,
  isEmailVerified: !!user.isEmailVerified,
});

// ===================================================
// POST /api/auth/register   -> matches P-8_New_registration_fyp.html
// ===================================================
exports.registerUser = async (req, res, next) => {
  try {
    const body = req.body || {};
    let { firstName, lastName, name, fullName, email, phone, city, password, confirmPassword, userType } = body;

    const nameInput = name || fullName;
    if (nameInput && (!firstName || !lastName)) {
      const parts = String(nameInput).trim().split(" ");
      firstName = parts[0] || "User";
      lastName = parts.slice(1).join(" ") || "Account";
    }

    if (!city) city = "Lahore";
    if (!userType || userType === "Horse Seller") userType = "User";
    if (!firstName) firstName = "User";
    if (!lastName) lastName = "Account";

    if (!email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidOfficialEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid official email address (e.g., name@gmail.com, name@domain.com)",
      });
    }

    if (confirmPassword !== undefined && confirmPassword !== "" && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Generate 6-digit OTP verification code
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email: cleanEmail }).select("+emailVerificationCode +emailVerificationExpires");

    if (user) {
      if (user.isEmailVerified) {
        return res.status(400).json({ success: false, message: "An account with this email already exists and is verified. Please log in." });
      } else {
        // User created earlier but not verified: update details and generate fresh OTP
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.city = city;
        user.password = password;
        user.userType = userType;
        user.emailVerificationCode = otp;
        user.emailVerificationExpires = otpExpires;
        await user.save();
      }
    } else {
      user = await User.create({
        firstName,
        lastName,
        email: cleanEmail,
        phone,
        city,
        password,
        userType,
        isEmailVerified: false,
        emailVerificationCode: otp,
        emailVerificationExpires: otpExpires,
        welcomeEmailSent: false,
      });
    }

    // Send 6-digit verification code from horsesquarepakistan@gmail.com to user's email
    const emailResult = await sendEmailVerificationOtp({
      email: cleanEmail,
      name: `${firstName} ${lastName}`.trim(),
      otp,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to dispatch email to ${cleanEmail}: ${emailResult.error}. Please check Google App Password in server/.env.`,
      });
    }

    // SECURITY: The OTP is strictly delivered to the user's email and never exposed in the response
    res.status(201).json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox and enter it below.`,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/verify-email-otp -> Verify 6-digit email OTP
// ===================================================
exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and 6-digit verification code are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+emailVerificationCode +emailVerificationExpires");

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email address" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified. Please sign in with your credentials.",
      });
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== cleanOtp) {
      return res.status(400).json({ success: false, message: "Invalid verification code. Please check your email and try again." });
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Verification code has expired. Please request a new code." });
    }

    // Mark user email as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Automatically send official Welcome Email from horsesquarepakistan@gmail.com
    if (!user.welcomeEmailSent) {
      sendWelcomeEmail(user)
        .then(async (result) => {
          if (result && result.success) {
            await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
          }
        })
        .catch((err) => {
          console.error("[WELCOME EMAIL DISPATCH ERROR]:", err.message);
        });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in with your credentials.",
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auth/resend-email-otp -> Resend 6-digit OTP
// ===================================================
exports.resendEmailOtp = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidOfficialEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid official email address" });
    }

    const user = await User.findOne({ email: cleanEmail }).select("+emailVerificationCode +emailVerificationExpires");

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Your email is already verified. Please sign in directly." });
    }

    // Generate fresh 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    user.emailVerificationCode = otp;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailResult = await sendEmailVerificationOtp({
      email: cleanEmail,
      name: `${user.firstName} ${user.lastName}`.trim(),
      otp,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to dispatch email to ${cleanEmail}: ${emailResult.error}. Please check Google App Password in server/.env.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `A fresh 6-digit verification code has been dispatched to ${cleanEmail}.`,
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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!isValidOfficialEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid official email address (e.g., name@gmail.com, name@domain.com)",
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select("+password +emailVerificationCode +emailVerificationExpires");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ success: false, message: "Your account has been blocked. Contact support." });
    }

    // Check if email has been verified via OTP
    if (!user.isEmailVerified) {
      // Generate fresh OTP code and dispatch it to their email
      const otp = crypto.randomInt(100000, 999999).toString();
      user.emailVerificationCode = otp;
      user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      const emailResult = await sendEmailVerificationOtp({
        email: cleanEmail,
        name: `${user.firstName} ${user.lastName}`.trim(),
        otp,
      });

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: `Your account is unverified, but we failed to send OTP to ${cleanEmail}: ${emailResult.error}. Please check Google App Password in server/.env.`,
        });
      }

      return res.status(403).json({
        success: false,
        requireVerification: true,
        email: cleanEmail,
        message: "Your email address is not verified yet. We have sent a 6-digit verification code to your email. Please verify your email to continue.",
      });
    }

    user.lastLogin = new Date();

    // If user has not received welcome email yet, send it on login
    if (!user.welcomeEmailSent) {
      sendWelcomeEmail(user)
        .then(async (result) => {
          if (result && result.success) {
            await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
          }
        })
        .catch((err) => {
          console.error("[WELCOME EMAIL DISPATCH ON LOGIN ERROR]:", err.message);
        });
    }

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
// POST /api/auth/test-welcome-email -> Test sending welcome email directly
// ===================================================
exports.testWelcomeEmail = async (req, res, next) => {
  try {
    const { email, name } = req.body || {};
    const targetEmail = email || "horsesquarepakistan@gmail.com";
    const targetName = name || "Valued Member";

    const dummyUser = {
      email: targetEmail,
      firstName: targetName.split(" ")[0] || "Valued",
      lastName: targetName.split(" ").slice(1).join(" ") || "Member",
      name: targetName,
    };

    const result = await sendWelcomeEmail(dummyUser);
    res.status(200).json({
      success: result.success,
      message: result.success
        ? `Official welcome email successfully dispatched to ${targetEmail}`
        : `Failed to dispatch email: ${result.error}`,
      details: result,
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
    const { email } = req.body || {};

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

    console.log(`📧 Password reset code for ${user.email}: ${resetCode}`);

    res.status(200).json({
      success: true,
      message: "Reset code sent successfully. Check your email.",
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
    const { email, code } = req.body || {};

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
    const { email, code, newPassword } = req.body || {};

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
    const { firstName, lastName, phone, cnic, address, city, userType, avatar } = req.body || {};
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (cnic !== undefined) user.cnic = cnic.trim();
    if (address !== undefined) user.address = address.trim();
    if (city !== undefined) user.city = city.trim();
    if (userType !== undefined) user.userType = userType;
    if (avatar !== undefined) user.avatar = avatar;

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
    const { currentPassword, newPassword } = req.body || {};

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
