const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

// import helper functions
const { generateID, getUserByEmail, urlsForUser } = require("./js/functions");
const {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
} = require("./js/errors");

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// ----------
// MIDDLEWARE
// ----------

// parse POST request body
app.use(express.urlencoded({ extended: true }));

// log HTTP requests in terminal
app.use(morgan("dev"));

// parse cookies
app.use(cookieParser());

// ------
// DATA
// ------

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

// ------
// ROUTES
// ------

// HOME
app.get("/", (req, res) => {
  res.send("Hello!");
});

// `My URLS` PAGE
app.get("/urls", (req, res) => {
  // error handling
  let cookie = req.cookies["user_id"];
  const { errMsgMain, errMsgSub, err } = errNotLoggedIn(cookie);

  // filter URLs specifically for logged in user
  const userUrls = urlsForUser(cookie, urlDatabase);

  const templateVars = {
    urls: userUrls,
    users,
    cookie,
    errMsgMain,
    errMsgSub,
    err,
  };
  if (err) return res.render("error", templateVars);
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  // error handling
  const cookie = req.cookies["user_id"];
  if (errNotLoggedIn(cookie).err) return;

  // create a new URL object
  const newURL = req.body;
  console.log(newURL);

  // generate a UID for the new URL
  newURL.id = generateID(36, 6);

  // check if URL begins with 'http' & append if not
  let { longURL } = newURL;
  if (longURL.substring(0, 4) !== "http") {
    longURL = `https://${longURL}`;
  }

  // add the new URL to our database
  urlDatabase[newURL.id] = {
    longURL,
    userID: cookie,
  };
  console.log(urlDatabase);

  // ask the browser to redirect to the 'urls/:id' route to display the new URL
  res.redirect(`/urls/${newURL.id}`);
});

// CREATE NEW URL PAGE
app.get("/urls/new", (req, res) => {
  // error handling
  let cookie = req.cookies["user_id"];
  const { errMsgMain, errMsgSub, err } = errNotLoggedIn(cookie);

  const templateVars = {
    users,
    cookie,
    errMsgMain,
    errMsgSub,
    err,
  };
  if (err) return res.render("error", templateVars);
  res.render("urls_new", templateVars);
});

// delete URL
app.post("/urls/:id/delete", (req, res) => {
  // error handling
  const cookie = req.cookies["user_id"];
  if (errNotLoggedIn(res, cookie).err) return;

  const id = req.params.id;
  if (errDoesNotExist(id, urlDatabase).err) return;
  if (errDoesNotBelongToUser(id, cookie, urlDatabase).err) return;

  delete urlDatabase[id];
  res.redirect("/urls");
});

// SINGLE URL DETAILS PAGE
app.get("/urls/:id", (req, res) => {
  // error handling
  const cookie = req.cookies["user_id"];
  if (errNotLoggedIn(res, cookie).err) return;

  const id = req.params.id;
  if (errDoesNotExist(id, urlDatabase).err) return;
  if (errDoesNotBelongToUser(id, cookie, urlDatabase).err) return;

  const templateVars = {
    id,
    longURL: urlDatabase[id].longURL,
    users,
    cookie: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  // error handling
  const cookie = req.cookies["user_id"];
  if (errNotLoggedIn(res, cookie)) return;

  const id = req.params.id;
  if (errDoesNotExist(id, urlDatabase).err) return;
  if (errDoesNotBelongToUser(id, cookie, urlDatabase).err) return;

  // check if URL begins with 'http' & append if not
  let longURL = req.body.longURL;
  if (longURL.substring(0, 4) !== "http") {
    longURL = `https://${longURL}`;
  }

  urlDatabase[id] = {
    longURL,
    userID: req.cookies["user_id"],
  };
  console.log(urlDatabase);
  res.redirect("/urls");
});

// SHORT TO LONG URL REDIRECT PAGE
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  let longURL = urlDatabase[id].longURL;

  // if id doesn't exist in database, return error message
  if (!longURL) {
    return res.send("This short URL does not exist.");
  }

  res.redirect(longURL);
});

// USER REGISTRATION PAGE
app.get("/register", (req, res) => {
  const cookie = req.cookies["user_id"];
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
    password,
  };
  users[id] = user;

  console.log(users);

  // set a cookie for new user and then redirect
  res.cookie("user_id", id);
  res.redirect("/urls");
});

// USER LOGIN PAGE
app.get("/login", (req, res) => {
  const cookie = req.cookies["user_id"];
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

  console.log("User Login attempted");
  console.log("Email: ", email);
  console.log("Password: ", formPass);
  const userFound = getUserByEmail(email, users);

  // handle login errors
  if (!userFound) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  const { password, id } = userFound;
  if (password !== formPass) {
    res.status(403);
    return res.send("Error: Login not completed.");
  }

  // upon successful login, set a cookie for user and then redirect
  res.cookie("user_id", id);
  res.redirect("/urls");
});

// USER LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
