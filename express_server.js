const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");

const mainRoute = require("./routes/main");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const urlsRoute = require("./routes/urls");
const urlsConvertRoute = require("./routes/u");

// Setup & Middleware
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieSession({
    name: "session",
    keys: ["user_id"],
    maxAge: 24 * 60 * 60 * 1000, 
  })
);

// Routes
app.use("/main",mainRoute);
app.use("/login",loginRoute);
app.use("/register",registerRoute);
app.use("/urls",urlsRoute);
app.use("/u",urlsConvertRoute); 

// Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});