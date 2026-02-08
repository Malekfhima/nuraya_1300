const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

async function verifyAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminUser = await User.findOne({ email: "admin@example.com" });
    if (adminUser) {
      adminUser.isVerified = true;
      await adminUser.save();
      console.log("✅ Admin user verified successfully");
    } else {
      console.log("❌ Admin user not found");
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

verifyAdminUser();
