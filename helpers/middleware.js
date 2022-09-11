const { users, urlDatabase } = require("../db");

const {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
} = require("../helpers/errors");

const fullErrorHandler = (req, res, next) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
    exists: errDoesNotExist(id, urlDatabase),
    belongs: errDoesNotBelongToUser(id, userID, urlDatabase),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
    next();
  }
  next();
};

const loggedInErrorHandler = (req, res, next) => {
  const userID = req.session.user_id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    login: errNotLoggedIn(userID),
  });

  const { isError } = errorObject;
  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
  }
  next();
};

const urlExistsErrorHandler = (req, res, next) => {
  const userID = req.session.user_id;
  const id = req.params.id;
  const headerData = { users, userID };
  const errorObject = handleErrors({
    exists: errDoesNotExist(id, urlDatabase),
  });
  const { isError } = errorObject;

  if (isError) {
    errorObject.headerData = headerData;
    return res.render("error", errorObject);
    next();
  }
  next();
};

module.exports = {
  fullErrorHandler,
  loggedInErrorHandler,
  urlExistsErrorHandler,
};