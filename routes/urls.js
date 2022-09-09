const express = require("express");

const router = express.Router();
const { users, urlDatabase } = require("../db");

// ---------- HELPER FUNCTIONS
const {
    generateID,
    urlsForUser,
    appendHttp,
  } = require("../helpers/generic");
  
  const {
    errNotLoggedIn,
    errDoesNotExist,
    errDoesNotBelongToUser,
    handleErrors,
  } = require("../helpers/errors");


// GET: `My URLs` page
router.get("/", (req, res) => {
  // error handling
  let cookie = req.session.user_id;
  const errors = handleErrors({
    login: errNotLoggedIn(cookie),
  });

  // filter URLs specifically for logged in user
  const userUrls = urlsForUser(cookie, urlDatabase);

  const templateVars = {
    errors,
    urls: userUrls,
    users,
    cookie,
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
  let cookie = req.session.user_id;
  const errors = handleErrors({
    login: errNotLoggedIn(cookie),
  });

  if (errors === false) {
    const id = generateID(36, 6);
    const longURL = appendHttp(req.body.longURL);

    // add the new URL to our database
    urlDatabase[id] = {
      longURL,
      userID: cookie,
    };

    console.log("Url DB from POST /urls module:",urlDatabase)

    // redirect to the 'urls/:id' route to display the new URL
    return res.redirect(`/urls/${id}`);
  }
  const templateVars = { errors };
  return res.render("error", templateVars);
});


// GET: `NEW URL` page
router.get("/new", (req, res) => {
    const cookie = req.session.user_id;
  
    // check for errors
    const errors = handleErrors({
      login: errNotLoggedIn(cookie),
    });
  
    // if user isn't logged in, redirect to login page
    if (errors === false) {
      const templateVars = {
        users,
        cookie,
      };
      return res.render("urls_new", templateVars);
    }
    return res.redirect("/login");
  });

  // GET: Single URL details page
// CALLER: 'Edit' button on `My URLs` page
router.get("/:id", (req, res) => {
    const cookie = req.session.user_id;
    const id = req.params.id;
  
    const errors = handleErrors({
      login: errNotLoggedIn(cookie),
      exists: errDoesNotExist(id, urlDatabase),
      belongs: errDoesNotBelongToUser(id, cookie, urlDatabase),
    });
  
    const templateVars = {
      errors,
      users,
      cookie,
      id,
    };
  
    console.log("Url DB from urls-id module:",urlDatabase)
    console.log("Errors from urls-id module:",errors)
    
  
    if (errors !== false) {
      return res.render("error", templateVars);
    }
  
    templateVars["longURL"] = urlDatabase[id].longURL;
    console.log("Url DB from urls-id module:",urlDatabase)
    res.render("urls_show", templateVars);
  });
  
  // POST
  router.post("/:id", (req, res) => {
    const cookie = req.session.user_id;
    const id = req.params.id;
  
    // check for errors
    const errors = handleErrors({
      login: errNotLoggedIn(cookie),
      exists: errDoesNotExist(id, urlDatabase),
      belongs: errDoesNotBelongToUser(id, cookie, urlDatabase),
    });
  
    if (errors !== false) {
      const templateVars = {
        errors,
        users,
        id,
        cookie,
      };
      return res.render("error", templateVars);
    }
    const longURL = appendHttp(req.body.longURL);
  
    urlDatabase[id] = {
      longURL,
      userID: cookie,
    };
    return res.redirect("/urls");
  });
  
  // CRUD - [D]elete URL
  router.post("/:id/delete", (req, res) => {
    const cookie = req.session.user_id;
    const id = req.params.id;
  
    console.log("Url DB from del module:",urlDatabase)
  
    // check for errors
    const errors = handleErrors({
      login: errNotLoggedIn(cookie),
      exists: errDoesNotExist(id, urlDatabase),
      belongs: errDoesNotBelongToUser(id, cookie, urlDatabase),
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
      cookie,
    };
  
    return res.render("error", templateVars);
  });

module.exports = router;
