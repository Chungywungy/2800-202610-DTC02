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

/**
 * Fetch raw parks data from opendata.vancouver.ca
 * Limited to 100 results for each call, continues calling using offset until all parks fetched
 * @returns {Array} Raw parks data from opendata.vancouver.ca
 */
router.get("/parks", async (req, res) => {
  try {
    const parksData = [];
    const limit = 100;
    let offset = 0;

    while (true) {
      const results = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/parks-polygon-representation/records?limit=${limit}&offset=${offset}`,
      );
      const resultsJSON = await results.json();

      for (let i = 0; i < resultsJSON.results.length; i++) {
        parksData.push(resultsJSON.results[i]);
      }

      if (resultsJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(parksData);
  } catch (error) {
    console.log("Error fetching parks:", error);
    res.status(500).json({ error: "Failed to fetch parks" });
  }
});

module.exports = router;
