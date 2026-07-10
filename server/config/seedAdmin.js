const User = require("../models/User");

// Automatically creates a default admin account on first server start,
// using ADMIN_EMAIL / ADMIN_PASSWORD from your .env file.
// This is how you log into the admin dashboard the very first time.
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@horsesquare.pk";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return; // already exists, nothing to do

    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      phone: "+923000000000",
      city: "Lahore",
      password: adminPassword,
      userType: "Horse Seller", // arbitrary, not used for admins
      role: "admin",
    });

    console.log("👑 Default admin account created:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("   ⚠️  Change this password after first login in a real deployment.");
  } catch (error) {
    console.error("Failed to seed admin account:", error.message);
  }
}

module.exports = seedAdmin;
