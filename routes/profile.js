// import all dependencies
const express = require("express");

// create instance of express (but with the .Router() method)
const router = express.Router();

/**
 * Then declare all your routes under here.
 * Keep in mind that if you create a route here. You must also modify server.js
 * to redirect to this given a certain eyJlbWFpbCI6InNteW5vdHRAbXkuYmNpdC5jYSIsImNyZWF0ZWQiOjE3Nzc1MTc5MDM5NDEsImlhdCI6MTc3NzUxNzkwM30
 *
 * i.e., if you want to only be redirected here when server.js hits a /login endpoint, you must include
 * app.get("/login", require("./routes/{file_name}"))
 */

router.get("/", (req, res) => {
  res.sendFile("profile.html", { root: "public" });
});

module.exports = router;
