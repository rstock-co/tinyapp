const express = require("express");

const router = express.Router();
const { urlDatabase } = require("../db");

// ---------- HELPER FUNCTIONS

const {
  errDoesNotExist,

  handleErrors,
} = require("../helpers/errors");

// SHORT TO LONG URL REDIRECT PAGE
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const errors = handleErrors({
    exists: errDoesNotExist(id, urlDatabase),
  });
  if (errors === false) {
    let longURL = urlDatabase[id].longURL;
    return res.redirect(longURL);
  }
  const templateVars = { errors };
  return res.render("error", templateVars);
});

module.exports = router;
