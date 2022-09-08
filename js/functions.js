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
  if (!id) return null;
  let urls = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url]
    }
  }
  return urls;
}

module.exports = { generateID, getUserByEmail, urlsForUser };
