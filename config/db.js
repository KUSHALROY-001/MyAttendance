const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
