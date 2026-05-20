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

router.post("/", async (req, res) => {
  let username = req.body.username;
  let achievementName = req.body.achievementName;

  if (!username) res.status(500).send({ message: "Please submit a username" });
  if (!achievementName)
    res.status(500).send({ message: "Please submit an achievement name" });

  try {
    let achievementAdded = await achievementModel.updateOne(
      { username: username },
      { $set: { achievementName: achievementName, username: username } },
      { upsert: true }, // insert if not found
    );
    res.status(200).send(achievementAdded);
  } catch (error) {
    console.log("Error associating achievement to user:", error);
    res.status(500).json({
      error: "Failed to associate achievement to user",
      message: error,
    });
  }
});

module.exports = router;
