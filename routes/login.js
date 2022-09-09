const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const { users } = require("../db");

// ---------- HELPER FUNCTIONS

const { getUserByEmail } = require("../helpers/generic");

// USER LOGIN PAGE
router.get("/",(req, res) => {
  const cookie = req.session.user_id;
  if (cookie) {
    return res.redirect("/urls");
  }
  const templateVars = {
    users,
    cookie,
  };
  res.render("urls_login", templateVars);
});

router.post("/",(req, res) => {
  const email = req.body.email;
  const formPass = req.body.password;

  const userFound = getUserByEmail(email, users);

  // handle login errors
  if (!userFound) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  if (!bcrypt.compareSync(formPass, password)) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  // upon successful login, set a cookie for user and then redirect
  req.session.user_id = id;
  res.redirect("/urls");
});

module.exports = router;