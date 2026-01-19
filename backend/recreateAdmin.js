const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

async function recreateAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing admin user
    await User.deleteOne({ email: "admin@example.com" });

    // Create new admin user (password will be hashed automatically)
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
      isVerified: true,
    });

    await adminUser.save();
    console.log("✅ Admin user recreated with hashed password");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

recreateAdminUser();
