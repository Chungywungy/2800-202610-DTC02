// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

// fetch current weather data
router.get("/", async (req, res) => {
  const apiKey = process.env.OPENWEATHER_KEY;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=${apiKey}&units=metric`,
  );

  const data = await response.json();
  res.json(data);
});

module.exports = router;
