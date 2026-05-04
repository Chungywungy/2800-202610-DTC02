// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/login", (req, res) => {
  res.send("Here lies the login logic");
});

module.exports = router;
