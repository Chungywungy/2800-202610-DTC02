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

router.get("/washrooms", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const washroomData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-washrooms/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        washroomData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(washroomData);
  } catch (error) {
    console.log("Error fetching washrooms:", error);
    res.status(500).json({ error: "Failed to fetch washrooms" });
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

// fetch shade key for shade api
router.get("/key", async (req, res) => {
  res.json({ key: process.env.SHADE_API });
});

// fetch community centres data
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

/**
 * Route for fetching a filtered subset of public trees within the City of Vancouver.
 *
 * DISCLAIMER: This route intentionally limits the dataset to tree families that
 * provide good canopy coverage. As loading all ~180,000 public trees would result
 * in performance issues.
 *
 * A tree that satisfies this criteria is if they belong to a specific family of trees,
 * have a height >= 6m and diameter >= 20cm
 *
 * Reference: Claude used to determine family of trees that provide sufficient canopy coverage
 * Reference: Huwise/OpenDataSoft used to construct filtered queries and geo_cluster feature (https://help.opendatasoft.com/apis/ods-explore-v2/#section/Introduction)
 */
router.get("/public-trees", async (req, res) => {
  // Structured with quotations to make ODSQL query work
  const SPECIES_OF_TREES_WITH_CANOPY_COVERAGE = [
    '"ACER"',
    '"QUERCUS"',
    '"TILIA"',
    '"PLATANUS"',
    '"FRAXINUS"',
    '"ULMUS"',
    '"FAGUS"',
    '"CASTANEA"',
    '"AESCULUS"',
    '"ROBINIA"',
    '"LIRIODENDRON"',
    '"LIQUIDAMBAR"',
    '"CARPINUS"',
  ];

  // A request to this endpoint must include a zoom level and radius
  const zoom = Math.min(parseInt(req.query.zoom) || 13, 16); // the zoom level (fetched using map.getZoom() ), cap at 16
  const radius = Math.max(80 - zoom * 4, 20); // the max cluster radius size: the smaller the more markers, shrinks as zoom increases, floor of 20

  // Bounding box - only returns results from the passed bbox (best practice: should return the map's bounds / viewport screen) default to Vancouver
  const bbox = req.query.bbox || "49.20,-123.22,49.36,-122.98";
  const [south, west, north, east] = bbox.split(","); // unpack

  // Filter trees that are:
  const where = [
    `in_bbox(geo_point_2d, ${south}, ${west}, ${north}, ${east})`, // (1) Inside the given bounding box
    `height_m >= 6`, // (2) Tree height >= 6m
    `diameter_cm >= 20`, // (3) Trunk diameter >= to 20cm
    `genus_name in (${SPECIES_OF_TREES_WITH_CANOPY_COVERAGE.join(", ")})`, // (4) Part of the aforementioned species of trees
  ].join(" AND ");

  const queryParams = new URLSearchParams({
    group_by: `geo_cluster(geo_point_2d, ${zoom}, ${radius})`, // sets the search to a geo_cluster search
    select: "count(*) as count", // gets the number of trees within a given cluster
    where, // filter logic
    limit: 100,
  });

  const url = `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-trees/records?${queryParams}`; // Base API call + additional params for filtering and geo clustering

  const result = await fetch(url);
  const resultJSON = await result.json();
  res.send(resultJSON);
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
