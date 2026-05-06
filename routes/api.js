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

module.exports = router;
