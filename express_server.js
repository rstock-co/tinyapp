const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();

const {generateID} = require('./js/functions');
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

// MIDDLEWARE

// parse POST request body
app.use(express.urlencoded({ extended: true }));

// log HTTP requests in terminal
app.use(morgan('dev'));

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

// ROUTES

//home
app.get("/", (req, res) => {
  res.send("Hello!");
});

//urls
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"], 
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  // create a new URL object
  const newURL = req.body;
  console.log(newURL);

  // generate a UID for the new URL
  newURL.id = generateID(36, 6);
  console.log(newURL.id);

  // add the new URL to our database
  urlDatabase[newURL.id] = newURL.longURL;
  console.log(urlDatabase);

  // ask the browser to redirect to the 'urls/:id' route to display the new URL
  res.redirect(`/urls/${newURL.id}`);
});

// create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

// delete URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];

  res.redirect('/urls');
  });

// single URL
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = longURL;
  console.log(urlDatabase)
  res.redirect("/urls");
});

// redirect from short URL to long URL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
 }); 


// login / logout form in nav header bar
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

// user registration page
app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_register",templateVars);
});

app.post("/register", (req, res) => {
  const id = generateID(36, 6);
  const email = req.body.email;
  const password = req.body.password;
  
  // create object for new user then add to data store
  const user = {
    id,
    email,
    password,
  }
  users[id] = user;

  // set a cookie for new user and then redirect
  res.cookie('user_id', id);
  res.redirect("/urls");
})

// SAMPLE CODE (erase later)
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
