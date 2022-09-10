const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) return res.redirect("/urls");
  res.redirect("/login");
});

module.exports = router;
