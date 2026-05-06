// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/", (req, res) => {
  res.send(process.env.SHADE_API);
});

module.exports = router;
