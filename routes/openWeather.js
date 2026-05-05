// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/weather", (req, res) => {
  const apiKey = process.env.OPENWEATHER_KEY;

  res.send(`Your API key is: ${apiKey}`);
});

module.exports = router;
