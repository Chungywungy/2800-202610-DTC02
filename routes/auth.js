// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.post("/login", (req, res) => {
  res.json({ message: "Here lies the login logic", result: req.body });
});

router.post("/register", (req, res) => {
  res.json({ message: "Here lies the register logic", result: req.body });
});

module.exports = router;
