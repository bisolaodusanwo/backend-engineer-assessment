const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/protected", authenticateToken, (req, res) => {
  console.log("Protected Route Accessed By User:", req.user);
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});

module.exports = router;
