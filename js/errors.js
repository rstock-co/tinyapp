const errNotLoggedIn = (cookie) => {
  let err = false;
  if (!cookie) err = true;
  return {
    err,
    errMsgMain: "You must be registered or logged in to perform this action.",
    errMsgSub: `Click on 'Login' or 'Register' link in navbar above.`,
  };
};

const errDoesNotExist = (id, database) => {
  let err = false;
  if (!database[id]) err = true;
  return {
    err,
    errMsgMain: "This URL does not exist.",
    errMsgSub: `Click on 'Create New URL' to add new URLs to your profile.`,
  };
};

const errDoesNotBelongToUser = (id, cookie, database) => {
  let err = false;
  if (database[id].userID !== cookie) err = true;
  return {
    err,
    errMsgMain: "Could not find URL in your User Profile.",
    errMsgSub: `Click on 'Create New URL' to add new URLs to your profile.`,
  };
};

module.exports = { errNotLoggedIn, errDoesNotExist, errDoesNotBelongToUser };
