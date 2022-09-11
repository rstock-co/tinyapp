const express = require("express");
const router = express.Router();

 /**
 *  POST /logout
 *  Logs the user out, ends the session and redirects to /urls
 */

router.post("/", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

module.exports = router;
