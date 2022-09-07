const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = (numChars, stringLength) =>
  Math.random()
    .toString(numChars)
    .substring(3, stringLength + 3);

app.set("view engine", "ejs");

// middleware to parse POST request body
app.use(express.urlencoded({ extended: true }));

// middleware to log HTTP requests in terminal
app.use(morgan('dev'));

// middleware to parse cookies
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

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
  newURL.id = generateRandomString(36, 6);
  console.log(newURL.id);

  // add the new URL to our database
  urlDatabase[newURL.id] = newURL.longURL;
  console.log(urlDatabase);

  // ask the browser to redirect to the 'urls/:id' route to display the new URL
  res.redirect(`/urls/${newURL.id}`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];

  res.redirect('/urls');
  });

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

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
 }); 

// It should set a cookie named `username` to the value submitted 
// in the request body via the login form. 
// After our server has set the cookie it should redirect 
// the browser back to the /urls page. We don't need to provide the (optional) options for now.

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
