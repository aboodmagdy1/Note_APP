const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("connected to database");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
