const express = require("express");

const router = express.Router();
const { users, urlDatabase } = require("../db");

// ---------- HELPER FUNCTIONS
const { generateID, urlsForUser, appendHttp } = require("../helpers/generic");

const {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
} = require("../helpers/errors");

// GET: `My URLs` page
router.get("/", (req, res) => {
  // error handling
  const userID = req.session.user_id;
  const errors = handleErrors({
    login: errNotLoggedIn(userID),
  });

  // filter URLs specifically for logged in user
  const userUrls = urlsForUser(userID, urlDatabase);

  const templateVars = {
    errors,
    urls: userUrls,
    users,
    userID,
  };
  if (errors === false) {
    return res.render("urls_index", templateVars);
  }
  return res.render("error", templateVars);
});

// CRUD - [C]reate new URL
// CALLER:  `Create` button on `urls_new` template
router.post("/", (req, res) => {
  // error handling
  const userID = req.session.user_id;
  const errors = handleErrors({
    login: errNotLoggedIn(userID),
  });
  const id = generateID(36, 6);
  if (errors === false) {
    
    const longURL = appendHttp(req.body.longURL);

    // add the new URL to our database
    urlDatabase[id] = {
      longURL,
      userID: userID,
    };

    // redirect to the 'urls/:id' route to display the new URL
    return res.redirect(`/urls/${id}`);
  }
  const templateVars = { errors, users, id, userID };
  return res.render("error", templateVars);
});

// GET: `New URL` page
router.get("/new", (req, res) => {
  const userID = req.session.user_id;

  // check for errors
  const errors = handleErrors({
    login: errNotLoggedIn(userID),
  });

  // if user isn't logged in, redirect to login page
  if (errors === false) {
    const templateVars = {
      users,
      userID,
    };
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
});

// GET: Single URL details page
router.get("/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;

  const errors = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  const templateVars = {
    errors,
    users,
    userID,
    id,
  };

  if (errors !== false) {
    return res.render("error", templateVars);
  }

  templateVars["longURL"] = urlDatabase[id].longURL;
  res.render("urls_show", templateVars);
});

// POST
router.post("/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;

  // check for errors
  const errors = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  if (errors !== false) {
    const templateVars = {
      errors,
      users,
      id,
      userID,
    };
    return res.render("error", templateVars);
  }
  const longURL = appendHttp(req.body.longURL);

  urlDatabase[id] = {
    longURL,
    userID: userID,
  };
  return res.redirect("/urls");
});

// CRUD - [D]elete URL
router.post("/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;

  // check for errors
  const errors = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  // if no errors, delete URL
  if (errors === false) {
    delete urlDatabase[id];
    res.redirect("/urls");
  }

  const templateVars = {
    errors,
    users,
    id,
    userID,
  };

  return res.render("error", templateVars);
});

module.exports = router;
