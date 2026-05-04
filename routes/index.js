// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

// middlewares
router.use(express.static(__dirname));

// invoked for any requests passed to this router
router.use((req, res, next) => {
  // .. some logic here .. like any other middleware
  next();
});

router.get("/home", (req, res) => {
  res.send("hello");
});

router.get("/", (req, res) => {
  res.redirect(__dirname + "/home");
});

router.get("/home", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = router;
