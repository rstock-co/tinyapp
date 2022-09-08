const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

const { generateID, getUserByEmail } = require("./js/functions");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// MIDDLEWARE

// parse POST request body
app.use(express.urlencoded({ extended: true }));

// log HTTP requests in terminal
app.use(morgan("dev"));

// parse cookies
app.use(cookieParser());

// DATA

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
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// ------
// ROUTES
// ------

// HOME
app.get("/", (req, res) => {
  res.send("Hello!");
});

// MY URLS TABLE PAGE
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    users,
    cookie: req.cookies["user_id"],
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const cookie = req.cookies["user_id"];
  if (!cookie) {
    return res.send("You must be logged in to shorten URLs.");
  }

  // create a new URL object
  const newURL = req.body;
  console.log(newURL);

  // generate a UID for the new URL
  newURL.id = generateID(36, 6);

  // add the new URL to our database
  urlDatabase[newURL.id] = newURL.longURL;
  console.log(urlDatabase);

  // ask the browser to redirect to the 'urls/:id' route to display the new URL
  res.redirect(`/urls/${newURL.id}`);
});

// CREATE NEW URL PAGE
app.get("/urls/new", (req, res) => {
  const cookie = req.cookies["user_id"];
  if (!cookie) {
    return res.redirect("/login");
  }
  const templateVars = {
    users,
    cookie,
  };
  res.render("urls_new", templateVars);
});

// delete URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// SINGLE URL DETAILS PAGE
app.get("/urls/:id", (req, res) => {

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    users,
    cookie: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = longURL;
  console.log(urlDatabase);
  res.redirect("/urls");
});

// SHORT TO LONG URL REDIRECT PAGE
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  let longURL = urlDatabase[id];
  // check if URL begins with 'http' & append if not
  if (longURL.substring(0, 4) !== 'http') {
    longURL = `https://${longURL}`
  }
  console.log(longURL)
  if (!id) {
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
    res.status(400);;
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
  if (!userFound ) {
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
