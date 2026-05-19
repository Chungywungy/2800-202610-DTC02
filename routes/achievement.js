// import all dependencies
const express = require("express");
const { achievementModel } = require("../mongodbAtlas");

// create instance of express (but with the .Router() method)
const router = express.Router();

// this is the /achievement endpoint
router.get("/", async (req, res) => {
  let username = req.query.username;
  if (!username) res.status(500).send({ message: "Please submit a username" });

  try {
    let achievements = await achievementModel.find({ username: username });
    res.status(200).send(achievements);
  } catch (error) {
    console.log("Error fetching achievements:", error);
    res.status(500).json({
      error: "Failed to fetch achievements",
      message: error,
    });
  }
});

module.exports = router;
