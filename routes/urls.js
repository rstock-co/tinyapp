const express = require("express");
const router = express.Router();
const { users, urlDatabase } = require("../db");

const { generateID, urlsForUser, appendHttp } = require("../helpers/generic");

const {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
} = require("../helpers/errors");

/**
 *  GET /urls
 *  Renders the `MyURLs` table containing the users URLs.
 *  Displays error message if the user is not logged in.
 */

router.get("/", (req, res) => {
  const userID = req.session.user_id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }

  const templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    headerData,
  };
  return res.render("urls_index", templateVars);
});

/**
 *  POST /urls
 *  Adds a new URL to db, then redirects to /urls/:id to display the new URL's details.
 *  Displays error message if the user is not logged in.
 */

router.post("/", (req, res) => {
  const userID = req.session.user_id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }

  const id = generateID(36, 6);
  const longURL = appendHttp(req.body.longURL);
  urlDatabase[id] = {
    longURL,
    userID: userID,
  };
  return res.redirect(`/urls/${id}`);
});

/**
 *  GET /urls/new
 *  Renders page for user to create a new URL.
 *  Redirects to /login if the user is not logged in.
 */

router.get("/new", (req, res) => {
  const userID = req.session.user_id;
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
  });

  const { isError } = errorObject;
  if (isError) return res.redirect("/login");

  const templateVars = {
    headerData: { users, userID },
  };
  return res.render("urls_new", templateVars);
});

/**
 *  GET /urls/:id
 *  Adds a new URL to db, then redirects to /urls/:id to display the new URL's details.
 *  Displays error message if the user is not logged in.
 */

router.get("/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }

  const templateVars = {
    headerData,
    id,
    longURL: urlDatabase[id].longURL,
  };
  res.render("urls_show", templateVars);
});

/**
 *  POST /urls/:id
 *  Replaces an existing long URL in db, then redirects to /urls.
 *  Displays error message if user isn't logged in, URL doesn't exist, or URL doesn't belong to the user.
 */

router.post("/:id", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }

  // if (errors !== false) {
  //   const templateVars = {
  //     errors,
  //     users,
  //     id,
  //     userID,
  //   };
  //   return res.render("error", templateVars);

  const longURL = appendHttp(req.body.longURL);
  urlDatabase[id] = {
    longURL,
    userID: userID,
  };
  return res.redirect("/urls");
});

/**
 *  POST /urls/:id/delete
 *  Deletes an existing URL from db, then redirects to /urls.
 *  Displays error message if user isn't logged in, URL doesn't exist, or URL doesn't belong to the user.
 */

router.post("/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }

  delete urlDatabase[id];
  res.redirect("/urls");

  // const templateVars = {
  //   errors,
  //   users,
  //   id,
  //   userID,
  // };

  // return res.render("error", templateVars);
});

module.exports = router;
