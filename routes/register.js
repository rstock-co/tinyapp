const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const { users } = require("../db");

// ---------- HELPER FUNCTIONS

const { generateID, getUserByEmail } = require("../helpers/generic");

// USER REGISTRATION PAGE
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

router.post("/",(req, res) => {
  const id = generateID(36, 6);
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userFound = getUserByEmail(email, users);

  // handle registration errors
  if (email === "" || password === "" || userFound) {
    res.status(400);
    return res.send("Error: Registration not completed.");
  }

  // create object for new user then add to data store
  const user = {
    id,
    email,
    password: hashedPassword,
  };
  users[id] = user;

  // set a userID for new user and then redirect
  req.session.user_id = id;
  res.redirect("/urls");
});

module.exports = router;