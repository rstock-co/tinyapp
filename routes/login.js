const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const { users } = require("../db");

const { getUserByEmail } = require("../helpers/generic");

/**
 *  GET /login
 *  Renders the login page, and redirects to /urls if already logged in
 */

router.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect("/urls");
  }
  const templateVars = {
    headerData: {users, userID}
  };
  res.render("urls_login", templateVars);
});

/**
 *  POST /login
 *  Checks if user already exists, checks password, then logs the user in.
 *  Creates a new cookie/session.
 */

router.post("/", (req, res) => {
  const email = req.body.email;
  const formPass = req.body.password;

  const userFound = getUserByEmail(email, users);

  if (!userFound) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  const password = userFound.password;
  const id = userFound.id;
  if (!bcrypt.compareSync(formPass, password)) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  req.session.user_id = id;
  res.redirect("/urls");
});

 /**
 *  POST /logout
 *  Logs the user out, ends the session and redirects to /urls
 */

router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

module.exports = router;
