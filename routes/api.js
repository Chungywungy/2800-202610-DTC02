// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

/**
 * Route for fetching a filtered subset of public trees within the City of Vancouver.
 *
 * DISCLAIMER: This route intentionally limits the dataset to tree families that
 * provide good canopy coverage. As loading all ~180,000 public trees would result
 * in performance issues.
 *
 * A tree that satisfies this criteria is if they belong to a specific family of trees,
 * have a height >= 6m and diameter >= 19cm
 *
 * Reference: Claude used to determine family of trees that provide sufficient canopy coverage
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
  // Filter trees that are: (1) Taller than or equal to 6m (2) Trunk diameter greater than or equal to 20cm (3) Part of the aforementioned species of trees
  const where = `height_m >= 6 AND diameter_cm >= 20 AND genus_name in (${SPECIES_OF_TREES_WITH_CANOPY_COVERAGE.join(", ")})`;

  const url = `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-trees/records?where=${encodeURIComponent(where)}&limit=100&offset=0`;
  const result = await fetch(url);
  const resultJSON = await result.json();
  res.send(resultJSON);
});

module.exports = router;
