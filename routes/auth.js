// import all dependencies
const express = require("express");
const { userModel } = require("../mongodbAtlas.js");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Hashing strength

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.post("/login", (req, res) => {
  res.json({ message: "Here lies the login logic", result: req.body });
});

// Reference: COMP2537 Assignment 1
router.post("/register", async (req, res) => {
  const requestedUsername = req.body.username;
  const requestedEmail = req.body.email;
  const requestedPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const requestedRole = req.body.role;

  const usernameAlreadyExists = await userModel.findOne({
    username: requestedUsername,
  });
  const emailAlreadyExists = await userModel.findOne({
    email: requestedEmail,
  });

  if (usernameAlreadyExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  if (emailAlreadyExists) {
    return res.status(409).json({ message: "Email already exists." });
  }

  if (requestedPassword != confirmPassword) {
    return res.status(422).json({ message: "Passwords do not match." });
  }

  if (requestedPassword.length < 6) {
    return res
      .status(422)
      .json({ message: "Password must be at least 6 characters." });
  }

  const hashedPassword = await bcrypt.hash(requestedPassword, SALT_ROUNDS);

  const createdAccount = await userModel.insertOne({
    username: requestedUsername,
    email: requestedEmail,
    password: hashedPassword,
    role: requestedRole,
  });

  return res.redirect("/login");
});

module.exports = router;
