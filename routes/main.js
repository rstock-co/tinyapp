const express = require("express");
const router = express.Router();

/**
 *  GET /
 *  Redirects to /urls if already logged in, and /login if not.
 */

router.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) return res.redirect("/urls");
  res.redirect("/login");
});

module.exports = router;
