const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

const fixStuckUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const email = "malekfhima1@gmail.com";
    const user = await User.findOne({ email });

    if (user) {
      await User.deleteOne({ _id: user._id });
      console.log(`User ${email} deleted successfully.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixStuckUser();
