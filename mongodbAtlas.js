// import all dependencies
const mongoose = require("mongoose");

/**
 * Schema for application users.
 *
 * Stores login credentials, account role, and verification status.
 */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["resident", "planner"],
    default: "resident",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model(`users`, userSchema);

/**
 * Schema for submitted user feedback reports.
 *
 * Stores report location, address, and message content.
 */
const formSchema = new mongoose.Schema({
  username: String,
  lat: Number,
  lng: Number,
  address: String,
  formText: String,
});

const formsModel = mongoose.model(`forms`, formSchema);

/**
 * Schema for user heat score formulas.
 *
 * Stores custom weighting values for heat score calculations.
 */
const formulaSchema = new mongoose.Schema({
  username: String,
  formula: {
    waterFountains: Number,
    washrooms: Number,
    parks: Number,
    communityCentres: Number,
    transit: Number,
  },
});

const formulaModel = mongoose.model(`formula`, formulaSchema);

/**
 * Connects to MongoDB Atlas using environment variables.
 *
 * @async
 */
const achievementSchema = new mongoose.Schema({
  username: String,
  achievementName: {
    type: String,
    enum: ["weather", "report"],
  },
});

const achievementModel = mongoose.model(`achievements`, achievementSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "test" });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connectToDatabase,
  userModel,
  formsModel,
  formulaModel,
  achievementModel,
};
