const errNotLoggedIn = (userID) => {
  if (userID) return { error: false };

  return {
    errorTitle: "User Not Found",
    errorMessage: "You must be registered or logged in to perform this action.",
    buttons: ["Register", "Login"],
    hrefs: ["/register", "/login"],
    error: true,
  };

};

const errDoesNotExist = (id, database) => {
  if (database[id]) return { error: false };

  return {
    errorTitle: "URL Does Not Exist",
    errorMessage:
      "This URL does not exist in the database. To create a URL, click `Create URL` below:",
    buttons: ["Create URL"],
    hrefs: ["/urls/new"],
    error: true,
  };
};

const errDoesNotBelongToUser = (id, userID, database) => {
  if (!database[id]) return { error: "does not exist" };
  if (database[id].userID === userID) return { error: false };
  return {
    errorTitle: "URL Does Not Belong To User",
    errorMessage:
      "This URL does not exist in your profile. To add a URL to your profile, click `Add URL` below:",
    buttons: ["Add URL"],
    hrefs: ["/urls/new"],
    error: true,
  };
};

const handleErrors = (errorObject) => {
  for (err in errorObject) {
    if (errorObject[err].error) return errorObject[err];
  }
  return false;
};

module.exports = {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
};
