const express = require("express");

const router = express.Router();
const { urlDatabase, users } = require("../db");

const { urlExistsErrorHandler } = require("../helpers/middleware.js")

/**
 *  GET /u/:id
 *  Redirects to the longURL associated with the short URL :id
 *  Displays error message if the given :id does not exist.
 */

router.get("/:id", urlExistsErrorHandler, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  return res.redirect(longURL);
});

module.exports = router;
