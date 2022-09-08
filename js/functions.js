// note that max value for base is 36: higher base = more alpha chars vs numeric chars
const generateID = (base, stringLength) =>
  Math.random()
    .toString(base)
    .substring(2, stringLength + 2);

// return either the entire user object or null if not found.
const getUserByEmail = (email, userDatabase) => {
  for (user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return null;
};

const urlsForUser = (id, urlDatabase) => {
  let urls = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url]
    }
  }
  return urls;
}

const errNotLoggedIn = (res, cookie) => {
  if (!cookie) {
    res.send("You must register or be logged in to do this.");
    return true;
  }
  return false;
}

const errDoesNotExist = (res, id, database) => {
  // if URL doesn't exist
  if (!database[id]) {
    res.send("This URL does not exist. Click on 'Create New URL' to add new URLs.");
    return true;
  }
  return false;
}
const errDoesNotBelongToUser = (res, id, cookie, database) => {
  // if URL doesn't belong to user
  if (database[id].userID !== cookie) {
    res.send("This URL is not in your database. Click on 'Create New URL' to add new URLs.");
    return true;
  }
  return false;
}

module.exports = { generateID, getUserByEmail, urlsForUser, errNotLoggedIn, errDoesNotExist, errDoesNotBelongToUser };
