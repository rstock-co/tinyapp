const express = require("express");

const router = express.Router();
const { urlDatabase } = require("../db");

const { urlExistsErrorHandler } = require("../helpers/middleware.js")

/**
 *  GET /u/:id
 *  Redirects to the longURL associated with the short URL :id
 *  Increments total visits and unique visits if userID is new
 *  Displays error message if the given :id does not exist.
 */

router.get("/:id", urlExistsErrorHandler, (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  const urls = urlDatabase[id];

  urls.totalVisits++;

  if (urls.visitors.length === 0 || !urls.visitors.includes(userID)) {
    urls.visitors.push(userID);
    urls.uniqueVisits = urls.visitors.length;
  }

  const longURL = urls.longURL;
  return res.redirect(longURL);
});

module.exports = router;
