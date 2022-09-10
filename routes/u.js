const express = require("express");

const router = express.Router();
const { urlDatabase, users } = require("../db");

const { errDoesNotExist, handleErrors } = require("../helpers/errors");

/**
 *  GET /u/:id
 *  Redirects to the longURL associated with the short URL :id
 *  Displays error message if the given :id does not exist.
 */

router.get("/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const errorObject = handleErrors({
    exists: errDoesNotExist(id, urlDatabase),
  });
  const { isError } = errorObject;

  if (isError) {
    const templateVars = { errorObject, users, id, userID };
    return res.render("error", templateVars);
  }

  const longURL = urlDatabase[id].longURL;
  return res.redirect(longURL);
});

module.exports = router;
