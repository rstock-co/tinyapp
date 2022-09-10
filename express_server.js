const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");

// ---------- IMPORTED ROUTES
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const urlsRoute = require("./routes/urls");
const urlsConvertRoute = require("./routes/u");

// ---------- SETUP & MIDDLEWARE
const app = express();
const PORT = 8080; 
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
    maxAge: 24 * 60 * 60 * 1000, 
  })
);

// Use imported routes
app.use("/login",loginRoute);
app.use("/register",registerRoute);
app.use("/urls",urlsRoute);
app.use("/u",urlsConvertRoute); 

// ---------- ROUTES & ENDPOINTS

// Homepage
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) return res.redirect("/urls");
  res.redirect("/login");
});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// ---------- CATCH ALL ROUTE ???

// ---------- LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});