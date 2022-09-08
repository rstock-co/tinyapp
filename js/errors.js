const errNotLoggedIn = (cookie) => {
  console.log('errNotLoggedIn ran')
  if (cookie) {
    console.log('From errNotLoggedIn: ', 'cookie found, user identified')
    return { error: false };
  }

  const obj = {
    errorTitle: "User Not Found",
    errorMessage: "You must be registered or logged in to perform this action.",
    buttons: ["Register", "Login"],
    hrefs: ["/register", "/login"],
    error: true,
  };

  console.log('obj: ', obj)

  return obj;

  // return {
  //   err,
  //   errMsgMain: ,
  //   errMsgSub: `Click on 'Login' or 'Register' link below.`,
  // };
};

const errDoesNotExist = (id, database) => {
  console.log('errDoesNotExist ran')
  if (database[id]) return { error: false };

  return {
    errorTitle: "URL Does Not Exist",
    errorMessage:
      "This URL does not exist in the database. To create a URL, click `Create URL` below:",
    buttons: ["Create URL"],
    hrefs: ["/urls/new"],
    error: true,
  };

  // return {
  //   err,
  //   errMsgMain: "This URL does not exist.",
  //   errMsgSub: `Click on 'Create New URL' to add new URLs to your profile.`,
  // };
};

const errDoesNotBelongToUser = (id, cookie, database) => {
  console.log('errDoesNotBelongToUser ran')
  if (!database[id]) return { error: "does not exist" };
  if (database[id].userID === cookie) return { error: false };
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
