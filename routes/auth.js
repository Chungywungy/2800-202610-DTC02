// import all dependencies
const express = require("express");
const { userModel, formulaModel } = require("../mongodbAtlas.js");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Hashing strength

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

// Reference: COMP2537 Assignment 1
router.post("/login", async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;

  const userFound = await userModel.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!userFound) {
    return res.status(409).json({ message: "User does not exist." });
  }

  const passwordMatch = await bcrypt.compare(password, userFound.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Incorrect password. Try again." });
  }
  req.session.user = {
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
  };
  if (rememberMe) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
  } else {
    req.session.cookie.expires = false; // expires when browser closes
  }
  return res.status(200).json({ message: "User logged in successfully." });
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
    email: requestedEmail.toLowerCase(),
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
    email: requestedEmail.toLowerCase(),
    password: hashedPassword,
    role: requestedRole,
  });

  await formulaModel.insertOne({
  username: requestedUsername,

  formula: {
    waterFountains: 0.25,
    washrooms: 0.25,
    parks: 0.25,
    communityCentres: 0.25,
  },
});

  return res
    .status(200)
    .json({ message: "Account created. Please login with credentials" });
});

module.exports = router;
