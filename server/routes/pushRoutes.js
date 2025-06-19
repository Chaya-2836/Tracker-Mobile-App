const express = require("express");
const router = express.Router();
const { registerToken } = require("./push/pushService");

router.post("/register-token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send("Missing token");
  registerToken(token);
  res.send("Token registered successfully.");
});

module.exports = router;