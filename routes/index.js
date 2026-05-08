// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "public" });
});

module.exports = router;
