// import all dependencies
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["resident", "planner"],
    default: "resident",
  },
});

const userModel = mongoose.model(`users`, userSchema);

const formSchema = new mongoose.Schema({
  username: String,
  lat: Number,
  lng: Number,
  address: String,
  formText: String,
});

const formsModel = mongoose.model(`forms`, formSchema);

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

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "test" });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectToDatabase, userModel, formsModel, formulaModel };
