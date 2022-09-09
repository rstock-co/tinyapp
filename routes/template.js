const express = require("express");

const router = express.Router();
const { users, urlDatabase } = require("../db");

// ---------- HELPER FUNCTIONS

const {
    generateID,
    getUserByEmail,
    urlsForUser,
    appendHttp,
  } = require("../helpers/generic");
  
  const {
    errNotLoggedIn,
    errDoesNotExist,
    errDoesNotBelongToUser,
    handleErrors,
  } = require("../helpers/errors");

// insert

  module.exports = router;