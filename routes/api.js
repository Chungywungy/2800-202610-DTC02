// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/fountains", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const fountainData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        fountainData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(fountainData);
  } catch (error) {
    console.log("Error fetching fountains:", error);
    res.status(500).json({ error: "Failed to fetch fountains" });
  }
});


// fetch current weather data
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  res.json(data);
});

router.get("/community-centres", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const communityCentresData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/community-centres/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        communityCentresData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(communityCentresData);
  } catch (error) {
    console.log("Error fetching community centres:", error);
    res.status(500).json({ error: "Failed to fetch community centres" });
  }
});

module.exports = router;
