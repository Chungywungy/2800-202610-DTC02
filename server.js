/**
 *  Main backend server
 */

// import all dependencies
const express = require("express");
// const mongoose = require("mongoose"); dont need
const session = require("express-session");
const { connectToDatabase } = require("./mongodbAtlas");
const FileStore = require("session-file-store")(session); // Not sure if we need this
require("dotenv").config();

// import dotenv files
const PORT = process.env.PORT || 5500;

// create instance of express
const app = express();

// declare all middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public", { index: false }));
app.use(
  session({
    store: new FileStore({
      path: "./sessions",
      secret: "mr. morale", // TODO: mask using dotenv when deploying
      retries: 1,
    }),
    secret: "mr. morale", // TODO: mask using dotenv when deploying
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // IMPORTANT: Change to true when deploying
    },
  }),
);

// connect to routes folder
/**
 * What happens is anytime one of the three routes are requested (/, /auth, /api)
 * it redirects to that folders directory
 */
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
app.use("/profile", require("./routes/profile"));

// connect to MongoDB Atlas
connectToDatabase();

// start server
app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
