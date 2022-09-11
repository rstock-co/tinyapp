const errNotLoggedIn = (userID) => {
  let isError = true;
  if (userID) isError = false;

  return {
    errorTitle: "User Not Found",
    errorMessage: "You must be registered or logged in to perform this action.",
    buttons: ["Register", "Login"],
    hrefs: ["/register", "/login"],
    isError,
  };
};

const errDoesNotExist = (id, database) => {
  let isError = true;
  if (database[id]) isError = false;

  return {
    errorTitle: "URL Does Not Exist",
    errorMessage:
      "This URL does not exist in the database. To create a URL, click `Create URL` below:",
    buttons: ["Create URL"],
    hrefs: ["/urls/new"],
    isError,
  };
};

const errDoesNotBelongToUser = (id, userID, database) => {
  let isError = true;
  if (database[id] && database[id].userID === userID) isError = false;

  return {
    errorTitle: "URL Does Not Belong To User",
    errorMessage:
      "This URL does not exist in your profile. To add a URL to your profile, click `Add URL` below:",
    buttons: ["Add URL"],
    hrefs: ["/urls/new"],
    isError,
  };
};

const handleErrors = (errorObject) => {
  for (obj in errorObject) {
    const error = errorObject[obj];
    if (error.isError) {
      return error;
    }
  }
  return { isError: false };
};

module.exports = {
  errNotLoggedIn,
  errDoesNotExist,
  errDoesNotBelongToUser,
  handleErrors,
};
