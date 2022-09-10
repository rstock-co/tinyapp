const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const { users } = require("../db");

const { generateID, getUserByEmail } = require("../helpers/generic");

/**
 *  Renders registration page, redirects to /urls if already logged in
 */

router.get("/",(req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect("/urls");
  }
  const templateVars = {
    users,
    userID,
  };
  res.render("urls_register", templateVars);
});

/**
 *  Registers the user, adds user to db, and creates a new cookie/session
 *  Redirects to /urls upon completion
 */

router.post("/",(req, res) => {
  const id = generateID(36, 6);
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userFound = getUserByEmail(email, users);

  if (email === "" || password === "" || userFound) {
    res.status(400);
    return res.send("Error: Registration not completed.");
  }

  const user = {
    id,
    email,
    password: hashedPassword,
  };
  users[id] = user;

  req.session.user_id = id;
  res.redirect("/urls");
});

module.exports = router;