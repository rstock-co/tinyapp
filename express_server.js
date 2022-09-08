const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

// ---------- HELPER FUNCTIONS

const {
  generateID,
  getUserByEmail,
  urlsForUser,
  appendHttp,
} = require("./js/helpers");

const {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
} = require("./js/errors");

// ---------- DATA

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  user3RandomID: {
    id: "aJ48lW",
    email: "easy@e.com",
    password: "abc",
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// ---------- SETUP & MIDDLEWARE

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// parse POST request body
app.use(express.urlencoded({ extended: true }));

// log HTTP requests in terminal
app.use(morgan("dev"));

// manage cookies
app.use(
  cookieSession({
    name: "session",
    keys: ["user_id"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// ---------- ROUTES & ENDPOINTS

// GET: Homepage
app.get("/", (req, res) => {
  let cookie = req.session.user_id;
  if (cookie) return res.redirect("/urls");
  res.redirect("/login");
});

// GET: `My URLS` page
app.get("/urls", (req, res) => {
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
app.post("/urls", (req, res) => {
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

    // redirect to the 'urls/:id' route to display the new URL
    return res.redirect(`/urls/${id}`);
  }
  const templateVars = { errors };
  return res.render("error", templateVars);
});

// GET: `NEW URL` page
app.get("/urls/new", (req, res) => {
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

// CRUD - [D]elete URL
app.post("/urls/:id/delete", (req, res) => {
  const cookie = req.session.user_id;
  const id = req.params.id;

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

// GET: Single URL details page
app.get("/urls/:id", (req, res) => {
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

  if (errors !== false) {
    return res.render("error", templateVars);
  }

  templateVars["longURL"] = urlDatabase[id].longURL;
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
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

// SHORT TO LONG URL REDIRECT PAGE
app.get("/u/:id", (req, res) => {
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

// USER REGISTRATION PAGE
app.get("/register", (req, res) => {
  const cookie = req.session.user_id;
  if (cookie) {
    return res.redirect("/urls");
  }
  const templateVars = {
    users,
    cookie,
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
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

  console.log(users);

  // set a cookie for new user and then redirect
  req.session.user_id = id;
  res.redirect("/urls");
});

// USER LOGIN PAGE
app.get("/login", (req, res) => {
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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const formPass = req.body.password;

  const userFound = getUserByEmail(email, users);

  // handle login errors
  if (!userFound) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  const { password, id } = userFound;

  if (!bcrypt.compareSync(formPass, password)) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  // upon successful login, set a cookie for user and then redirect
  req.session.user_id = id;
  res.redirect("/urls");
});

// USER LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// ---------- CRUD OPERATIONS

// ---------- CATCH ALL ROUTE

// ---------- LISTEN

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
