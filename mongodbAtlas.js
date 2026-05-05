// import all dependencies
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["City staff", "user"],
    default: "user",
  },
});

const userModel = mongoose.model(`users`, userSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectToDatabase, userModel };
